import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs";
import * as path from "path";

const execAsync = promisify(exec);

const TEMP_DIR = path.join(__dirname, "temp");

export const executeCodeInSandbox = async (
  code: string,
  language: string,
  input?: string
): Promise<string> => {
  const timestamp = Date.now();
  const normalizedLanguage = language.toLowerCase().trim();
  console.log(`Langage détecté : "${normalizedLanguage}"`);

  let imageName = "";
  let compileCommand = "";
  let execCommand = "";
  let fileExtension = "";

  switch (normalizedLanguage) {
    case "python":
      imageName = "sandbox-python";
      execCommand = "python";
      fileExtension = "py";
      break;
    case "javascript":
      imageName = "sandbox-node";
      execCommand = "node";
      fileExtension = "js";
      break;
    case "java":
      imageName = "sandbox-java";
      compileCommand = "javac";
      execCommand = "java";
      fileExtension = "java";
      break;
    case "c":
      imageName = "sandbox-c";
      compileCommand = "gcc";
      execCommand = "./a.out";
      fileExtension = "c";
      break;
    case "cpp":
    case "c++":
      imageName = "sandbox-cpp";
      compileCommand = "g++";
      execCommand = "./a.out";
      fileExtension = "cpp";
      break;
    default:
      throw new Error("Langage non supporté");
  }

  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
  }

  const filename = `temp_${timestamp}.${fileExtension}`;
  const filePath = path.join(TEMP_DIR, filename);
  const filesToDelete: string[] = [filePath];

  try {
    fs.writeFileSync(filePath, code, { encoding: "utf8" });

    let dockerCommand = "";
    if (compileCommand) {
      // Langages compilés
      let compileLine = `${compileCommand} /app/${filename}`;
      let runLine = normalizedLanguage === "java"
        ? `${execCommand} ${filename.replace(".java", "")}`
        : `${execCommand}`;

      if (input) {
        const inputFilename = `input_${timestamp}.txt`;
        const inputFilePath = path.join(TEMP_DIR, inputFilename);
        fs.writeFileSync(inputFilePath, input, { encoding: "utf8" });
        filesToDelete.push(inputFilePath);

        dockerCommand = `docker run --rm -v ${TEMP_DIR}:/app ${imageName} bash -c "${compileLine} && cat /app/${inputFilename} | ${runLine}"`;
      } else {
        dockerCommand = `docker run --rm -v ${TEMP_DIR}:/app ${imageName} bash -c "${compileLine} && ${runLine}"`;
      }
    } else {
      // Langages interprétés
      if (input) {
        const inputFilename = `input_${timestamp}.txt`;
        const inputFilePath = path.join(TEMP_DIR, inputFilename);
        fs.writeFileSync(inputFilePath, input, { encoding: "utf8" });
        filesToDelete.push(inputFilePath);

        dockerCommand = `docker run --rm -v ${TEMP_DIR}:/app ${imageName} bash -c "cat /app/${inputFilename} | ${execCommand} /app/${filename}"`;
      } else {
        dockerCommand = `docker run --rm -v ${TEMP_DIR}:/app ${imageName} ${execCommand} /app/${filename}`;
      }
    }

    const { stdout, stderr } = await execAsync(dockerCommand);

    if (stderr) console.error("Erreur dans le container :", stderr);

    return stdout;
  } catch (error) {
    console.error("Erreur d'exécution sandbox :", error);
    throw error;
  } finally {
    // Supprimer tous les fichiers même en cas d'erreur du dossier temp
    for (const file of filesToDelete) {
      try {
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      } catch (cleanupError) {
        console.error(`Erreur lors de la suppression de ${file} :`, cleanupError);
      }
    }
  }
};
