// script to generate types with the database
// run with `bun run gen-db-types`
//
// how it works:
// 1. load environment files with dotenv for the SUPABASE_PERSONAL_ACCESS_TOKEN and
//    SUPABASE_PROJECT_ID variables
// 2. make a request to
//    https://api.supabase.com/v1/projects/{ref}/types/typescript with
//    Authorization header set to "Authorization: Bearer {PAT}"
// 3. extract the "types" key from the response
// 4. write the types to the file specified by the --output flag

import { parseArgs } from "util";
import { resolve } from "node:path";

// Define the expected response shape
type SupabaseTypesResponse = {
  types: string;
};

// Type guard to verify the response shape
function isSupabaseTypesResponse(data: unknown): data is SupabaseTypesResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "types" in data &&
    typeof (data as SupabaseTypesResponse).types === "string"
  );
}

async function generateTypes(outputPath: string) {
  const personalAccessToken = process.env.SUPABASE_PERSONAL_ACCESS_TOKEN;
  const projectId = process.env.SUPABASE_PROJECT_ID;

  if (!personalAccessToken || !projectId) {
    throw new Error(
      "Missing SUPABASE_PERSONAL_ACCESS_TOKEN or SUPABASE_PROJECT_ID"
    );
  }

  const url = `https://api.supabase.com/v1/projects/${projectId}/types/typescript`;

  try {
    const resolvedPath = resolve(process.cwd(), outputPath);

    // Make the request to Supabase API
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${personalAccessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `API request failed with status ${
          response.status
        }: ${await response.text()}`
      );
    }

    const data = (await response.json()) as unknown;

    // Verify the response shape
    if (!isSupabaseTypesResponse(data)) {
      throw new Error("Invalid response format from API");
    }

    await Bun.write(resolvedPath, data.types);
    console.log(`Successfully wrote types to ${resolvedPath}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error generating types:", error.message);
    } else {
      console.error("Error generating types:", error);
    }
    process.exit(1);
  }
}

if (import.meta.path === Bun.main) {
  const { values } = parseArgs({
    args: Bun.argv,
    options: {
      output: {
        type: "string",
      },
    },
    strict: true,

    // it freaks out if we don't allow positionals
    allowPositionals: true,
  });

  const outputPath = values.output;
  if (!outputPath) {
    console.error("Missing output path");
    process.exit(1);
  }

  await generateTypes(outputPath);
}
