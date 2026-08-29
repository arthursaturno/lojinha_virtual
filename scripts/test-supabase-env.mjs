import fs from "node:fs";

const envPath = ".env.local";

if (!fs.existsSync(envPath)) {
  console.error("Arquivo .env.local nao encontrado.");
  process.exit(1);
}

const env = Object.fromEntries(
  fs
    .readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((line) => !line.trim().startsWith("#"))
    .map((line) => {
      const separatorIndex = line.indexOf("=");

      return [
        line.slice(0, separatorIndex).trim(),
        line
          .slice(separatorIndex + 1)
          .trim()
          .replace(/^['"]|['"]$/g, ""),
      ];
    }),
);

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, "");
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  process.exit(1);
}

let parsedUrl;

try {
  parsedUrl = new URL(supabaseUrl);
} catch {
  console.error("NEXT_PUBLIC_SUPABASE_URL nao e uma URL valida.");
  process.exit(1);
}

if (parsedUrl.protocol !== "https:" || !parsedUrl.hostname.endsWith(".supabase.co")) {
  console.error(`Host inesperado para Supabase: ${parsedUrl.hostname}`);
  process.exit(1);
}

const response = await fetch(`${supabaseUrl}/rest/v1/`, {
  headers: {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
  },
});

console.log(`SUPABASE_HOST=${parsedUrl.hostname.replace(/^[^.]+/, "***")}`);
console.log(`HTTP_STATUS=${response.status}`);

if (response.status >= 200 && response.status < 500) {
  console.log("CONNECTION_OK=true");
} else {
  console.log("CONNECTION_OK=false");
  process.exitCode = 1;
}
