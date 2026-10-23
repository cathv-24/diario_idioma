import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const folder = path.dirname(fileURLToPath(import.meta.url));
const runtime = process.argv[2];
let officialValidator;
if (runtime) {
  const require = createRequire(import.meta.url);
  officialValidator = require(path.resolve(runtime, 'node_modules/@n8n/workflow-sdk/dist/validation/node-parameter-schema/schema-validator.js'));
  officialValidator.setSchemaBaseDirs([path.resolve(runtime, 'node_modules/n8n-nodes-base/dist/node-definitions')]);
}
for (const file of fs.readdirSync(path.join(folder, 'n8n'))) {
  const workflow = JSON.parse(fs.readFileSync(path.join(folder, 'n8n', file), 'utf8'));
  assert.equal(workflow.active, false);
  const names = new Set(workflow.nodes.map(node => node.name));
  assert.equal(names.size, workflow.nodes.length);
  for (const [source, outputs] of Object.entries(workflow.connections)) {
    assert(names.has(source));
    for (const branches of Object.values(outputs)) for (const branch of branches)
      for (const edge of branch) assert(names.has(edge.node));
  }
  for (const node of workflow.nodes) {
    assert(!node.credentials, 'Export portable: no contiene IDs privados');
    if (officialValidator) {
      assert(officialValidator.loadSchema(node.type, node.typeVersion), `Falta esquema oficial ${node.type}`);
      const result = officialValidator.validateNodeConfig(node.type, node.typeVersion, { parameters: node.parameters });
      assert.equal(result.valid, true, JSON.stringify(result.errors));
    }
    if (node.type.endsWith('.code')) {
      const validate = body => vm.runInNewContext(`(function(){${node.parameters.jsCode}})()`, { $json: { body } });
      const sample = { eventId: '12345678-1234-1234-1234-123456789abc', type: 'entry.created',
        occurredAt: '2026-10-23T12:00:00Z', entryId: 1, entryDate: '2026-10-23',
        level: 'A2', score: 90, correctionCount: 2, wordCount: 12 };
      assert.equal(validate(sample).json.entryId, 1);
      for (const invalid of [null, { ...sample, texto: 'privado' }, { ...sample, score: 999 },
        { ...sample, eventId: 'bad' }, { ...sample, wordCount: -1 }, { ...sample, entryDate: '2026-02-31' }]) {
        assert.throws(() => validate(invalid));
      }
    }
  }
  console.log(`${file}: grafo, configuracion y contrato OK`);
}
