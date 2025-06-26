import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import $RefParser from '@apidevtools/json-schema-ref-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageRoot = path.resolve(__dirname, '..');
const projectRoot = path.resolve(packageRoot, '../..');
const specRoot = path.resolve(packageRoot, 'src/spec');
const distDir = path.resolve(packageRoot, 'dist');

const idMap = {
  "https://waymarks.dev/schema/runtime/node": path.join(specRoot, "runtime/node.schema.json"),
  "https://waymarks.dev/schema/runtime/location": path.join(specRoot, "runtime/location.schema.json"),
  "https://waymarks.dev/schema/waymark-grammar": path.join(specRoot, "core/grammar.schema.json"),
  "https://waymarks.dev/schema/waymark-dictionary": path.join(specRoot, "core/dictionary.schema.json"),
  "https://waymarks.dev/schema/config": path.join(specRoot, "config.schema.json"),
};

const customResolver = {
  order: 1,
  canRead(file) {
    return idMap[file.url] || file.url.startsWith(specRoot);
  },
  async read(file) {
    const filePath = idMap[file.url] || file.url;
    return fs.readFile(filePath, "utf-8");
  },
};

async function buildSchema() {
  console.log('Building Waymark base schema...');

  const entryPoint = path.join(specRoot, 'index.schema.json');

  try {
    const dereferenced = await $RefParser.dereference(entryPoint, {
        resolve: {
            file: true,
            custom: customResolver,
        }
    });

    await fs.mkdir(distDir, { recursive: true });

    const outputPath = path.join(distDir, 'waymark-base.schema.json');
    await fs.writeFile(outputPath, JSON.stringify(dereferenced, null, 2));

    console.log(`✅ Schema built successfully at ${path.relative(projectRoot, outputPath)}`);
  } catch (err) {
    console.error('❌ Schema build failed:', err);
    process.exit(1);
  }
}

buildSchema().catch(err => {
  console.error('An unexpected error occurred:', err);
  process.exit(1);
}); 