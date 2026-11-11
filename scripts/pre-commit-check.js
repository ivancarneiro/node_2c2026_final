#!/usr/bin/env node
import { execSync } from "node:child_process";
import fs from "node:fs";

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";
const CYAN = "\x1b[36m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

console.log(`\n${CYAN}=======================================================${RESET}`);
console.log(`${BLUE}${BOLD}🔍 Git Hook: Pre-Commit Check${RESET}`);
console.log(`${CYAN}   [1] Detección de Secretos${RESET}`);
console.log(`${CYAN}   [2] Validación de Sintaxis JavaScript${RESET}`);
console.log(`${CYAN}   [3] Análisis de Vulnerabilidades y CVEs${RESET}`);
console.log(`${CYAN}=======================================================\n${RESET}`);

let hasErrors = false;

// 1. Obtener archivos preparados en stage
let stagedFiles = [];
try {
  const output = execSync("git diff --cached --name-only --diff-filter=ACM", { encoding: "utf-8" });
  stagedFiles = output.trim().split("\n").filter(Boolean);
} catch (err) {
  // Ignorar en caso de error inicial
}

if (stagedFiles.length === 0) {
  console.log(`${YELLOW}No hay archivos en stage para verificar.${RESET}\n`);
  process.exit(0);
}

// ----------------------------------------------------
// 1. DETECCIÓN DE SECRETOS
// ----------------------------------------------------
console.log(`[1/3] 🔐 Verificando detección de secretos...`);

// A. Nombres de archivos sensibles prohibidos
const FORBIDDEN_FILE_PATTERNS = [
  /^\.env(\..+)?$/i,
  /\.pem$/i,
  /\.key$/i,
  /id_rsa/i,
  /serviceAccount.*\.json$/i,
  /credentials\.json$/i
];

for (const file of stagedFiles) {
  // Permitir explícitamente .env.example
  if (file === ".env.example" || file.endsWith("/.env.example")) continue;

  if (FORBIDDEN_FILE_PATTERNS.some(p => p.test(file))) {
    console.error(`  ${RED}✖ ERROR: Archivo confidencial detectado en stage: ${file}${RESET}`);
    console.error(`    -> Nunca confirmes archivos .env ni claves privadas al repositorio.`);
    hasErrors = true;
  }
}

// B. Búsqueda de patrones de credenciales reales en el diff
const SECRET_REGEXES = [
  { name: "Firebase / Google API Key", regex: /AIza[0-9A-Za-z_-]{25,}/ },
  { name: "Clave Privada RSA / EC / OpenSSH / PGP", regex: /-----BEGIN (RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----/ },
  { name: "AWS Access Key ID", regex: /AKIA[0-9A-Z]{16}/ },
  { name: "Token JWT en texto plano", regex: /eyJ[A-Za-z0-9_-]{20,}\.eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/ }
];

try {
  const diffOutput = execSync("git diff --cached", { encoding: "utf-8" });
  // Filtrar solo líneas agregadas (+)
  const addedLines = diffOutput
    .split("\n")
    .filter(line => line.startsWith("+") && !line.startsWith("+++"))
    .join("\n");

  for (const { name, regex } of SECRET_REGEXES) {
    if (regex.test(addedLines)) {
      console.error(`  ${RED}✖ ERROR: Se detectó un patrón de secreto: ${name}${RESET}`);
      console.error(`    -> Remueve la credencial del código antes de confirmar.`);
      hasErrors = true;
    }
  }
} catch (e) {
  // Error al inspeccionar el diff
}

if (!hasErrors) {
  console.log(`  ${GREEN}✔ Secretos: OK (No se detectaron credenciales ni archivos confidenciales).${RESET}`);
}

// ----------------------------------------------------
// 2. VERIFICACIÓN DE SINTAXIS JAVASCRIPT
// ----------------------------------------------------
console.log(`\n[2/3] ⚙️  Verificando sintaxis JavaScript (node --check)...`);
const jsFiles = stagedFiles.filter(f => f.endsWith(".js") || f.endsWith(".mjs"));

let syntaxErrors = 0;
for (const file of jsFiles) {
  if (fs.existsSync(file)) {
    try {
      execSync(`node --check "${file}"`, { stdio: "pipe" });
      console.log(`  ${GREEN}✔ ${file} (sintaxis válida)${RESET}`);
    } catch (err) {
      console.error(`  ${RED}✖ Error de sintaxis en: ${file}${RESET}`);
      console.error(`    ${err.stderr ? err.stderr.toString() : err.message}`);
      syntaxErrors++;
      hasErrors = true;
    }
  }
}
if (jsFiles.length === 0) {
  console.log(`  ${YELLOW}No se modificaron archivos JavaScript en este commit.${RESET}`);
}

// ----------------------------------------------------
// 3. ANÁLISIS DE VULNERABILIDADES (CVEs)
// ----------------------------------------------------
console.log(`\n[3/3] 🛡️  Verificando vulnerabilidades y CVEs (Audit)...`);
try {
  const isPnpm = fs.existsSync("pnpm-lock.yaml");
  const auditCmd = isPnpm ? "pnpm audit --audit-level high" : "npm audit --audit-level=high";
  execSync(auditCmd, { stdio: "pipe" });
  console.log(`  ${GREEN}✔ CVEs: OK (0 vulnerabilidades de nivel alto o crítico detectadas).${RESET}`);
} catch (auditErr) {
  console.error(`  ${RED}✖ ALERTA: Se detectaron vulnerabilidades conocidas en dependencias (CVEs).${RESET}`);
  console.error(`    -> Ejecuta 'npm audit' (o 'pnpm audit') y corrige mediante overrides/pnpm patch.`);
  hasErrors = true;
}

// ----------------------------------------------------
// EVALUACIÓN FINAL
// ----------------------------------------------------
console.log(`\n${CYAN}=======================================================${RESET}`);
if (hasErrors) {
  console.error(`${RED}${BOLD}⛔ COMMIT BLOQUEADO: Corrige los problemas señalados arriba.${RESET}`);
  console.log(`${CYAN}=======================================================\n${RESET}`);
  process.exit(1);
} else {
  console.log(`${GREEN}${BOLD}✨ Todas las validaciones pasaron con éxito. Confirmando commit...${RESET}`);
  console.log(`${CYAN}=======================================================\n${RESET}`);
  process.exit(0);
}
