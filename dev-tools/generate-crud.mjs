// ============================================================================
// One-time / repeatable code generator.
// Reads dev-tools/entityConfig.mjs and writes, for every entity:
//   backend/models/<Model>.js
//   backend/controllers/<entity>Controller.js
//   backend/routes/<entity>Routes.js
//
// Run with:  node dev-tools/generate-crud.mjs
// Safe to re-run - it overwrites the generated files deterministically.
// ============================================================================
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { entities } from './entityConfig.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.join(__dirname, '..', 'backend');
const modelsDir = path.join(backendDir, 'models');
const controllersDir = path.join(backendDir, 'controllers');
const routesDir = path.join(backendDir, 'routes');

for (const dir of [modelsDir, controllersDir, routesDir]) {
  fs.mkdirSync(dir, { recursive: true });
}

const lcFirst = (s) => s.charAt(0).toLowerCase() + s.slice(1);

// ---------------------------------------------------------------------------
// Model generator
// ---------------------------------------------------------------------------
function fieldToSchemaLine(field) {
  const opts = [];

  if (field.type === 'ObjectId') {
    opts.push(`type: mongoose.Schema.Types.ObjectId`);
    opts.push(`ref: '${field.ref}'`);
  } else if (field.type === 'Array') {
    return `${field.name}: { type: [${field.of || 'String'}], default: ${JSON.stringify(field.default || [])} }`;
  } else {
    opts.push(`type: ${field.type}`);
  }

  if (field.required) opts.push(`required: [true, '${field.name} is required']`);
  if (field.unique) opts.push(`unique: true`);
  if (field.enum) opts.push(`enum: ${JSON.stringify(field.enum)}`);
  if (field.default !== undefined) {
    opts.push(`default: ${field.default === 'Date.now' ? 'Date.now' : JSON.stringify(field.default)}`);
  }
  if (field.type === 'String' && !field.enum) opts.push('trim: true');

  return `${field.name}: { ${opts.join(', ')} }`;
}

function itemsArraySchema(field) {
  const priceField = field.priceField || 'unitCost';
  return `${field.name}: {
      type: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
          quantity: { type: Number, default: 1 },
          ${priceField}: { type: Number, default: 0 },
          _id: false,
        },
      ],
      default: [],
    }`;
}

function generateModel(entity) {
  const lines = entity.fields.map((field) => {
    if (field.type === 'ItemsArray') return itemsArraySchema(field);
    return fieldToSchemaLine(field);
  });

  return `import mongoose from 'mongoose';

const ${lcFirst(entity.model)}Schema = new mongoose.Schema(
  {
    ${lines.join(',\n    ')},
  },
  { timestamps: true }
);

${lcFirst(entity.model)}Schema.index({ createdAt: -1 });

export default mongoose.model('${entity.model}', ${lcFirst(entity.model)}Schema);
`;
}

// ---------------------------------------------------------------------------
// Controller generator - generic list/get/create/update/delete
// ---------------------------------------------------------------------------
function firstSearchableField(entity) {
  const f = entity.fields.find(
    (f) => f.type === 'String' && !f.enum && f.name !== 'sku'
  );
  return f ? f.name : null;
}

function populateFields(entity) {
  return entity.fields
    .filter((f) => f.type === 'ObjectId')
    .map((f) => f.name);
}

function generateController(entity) {
  const varName = lcFirst(entity.model);
  const searchField = firstSearchableField(entity);
  const populate = populateFields(entity);
  const populateChain = populate.length
    ? populate.map((p) => `.populate('${p}')`).join('')
    : '';

  return `import asyncHandler from 'express-async-handler';
import ${entity.model} from '../models/${entity.model}.js';

// @desc    Get all ${entity.labelPlural} (search + pagination)
// @route   GET /api/${entity.key}
// @access  Private
export const get${entity.model}List = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;

  const query = {};
  ${
    searchField
      ? `if (search) {
    query.${searchField} = { $regex: search, $options: 'i' };
  }`
      : '// This model has no default text field to search on.'
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;

  const [items, total] = await Promise.all([
    ${entity.model}.find(query)
      ${populateChain}
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    ${entity.model}.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: items,
    pagination: {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      limit: limitNum,
    },
  });
});

// @desc    Get single ${entity.label}
// @route   GET /api/${entity.key}/:id
// @access  Private
export const get${entity.model} = asyncHandler(async (req, res) => {
  const item = await ${entity.model}.findById(req.params.id)${populateChain};
  if (!item) {
    res.status(404);
    throw new Error('${entity.label} not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Create ${entity.label}
// @route   POST /api/${entity.key}
// @access  Private
export const create${entity.model} = asyncHandler(async (req, res) => {
  const item = await ${entity.model}.create(req.body);
  res.status(201).json({ success: true, data: item });
});

// @desc    Update ${entity.label}
// @route   PUT /api/${entity.key}/:id
// @access  Private
export const update${entity.model} = asyncHandler(async (req, res) => {
  const item = await ${entity.model}.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error('${entity.label} not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Delete ${entity.label}
// @route   DELETE /api/${entity.key}/:id
// @access  Private
export const delete${entity.model} = asyncHandler(async (req, res) => {
  const item = await ${entity.model}.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('${entity.label} not found');
  }
  await item.deleteOne();
  res.json({ success: true, data: {} });
});
`;
}

// ---------------------------------------------------------------------------
// Route generator
// ---------------------------------------------------------------------------
function generateRoute(entity) {
  const varName = lcFirst(entity.model);
  return `import express from 'express';
import {
  get${entity.model}List,
  get${entity.model},
  create${entity.model},
  update${entity.model},
  delete${entity.model},
} from '../controllers/${varName}Controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(get${entity.model}List)
  .post(authorize('admin', 'manager', 'editor'), create${entity.model});

router
  .route('/:id')
  .get(get${entity.model})
  .put(authorize('admin', 'manager', 'editor'), update${entity.model})
  .delete(authorize('admin', 'manager'), delete${entity.model});

export default router;
`;
}

// ---------------------------------------------------------------------------
// Write files
// ---------------------------------------------------------------------------
let count = 0;
for (const entity of entities) {
  fs.writeFileSync(
    path.join(modelsDir, `${entity.model}.js`),
    generateModel(entity)
  );
  fs.writeFileSync(
    path.join(controllersDir, `${lcFirst(entity.model)}Controller.js`),
    generateController(entity)
  );
  fs.writeFileSync(
    path.join(routesDir, `${entity.key}Routes.js`),
    generateRoute(entity)
  );
  count++;
}

console.log(`Generated ${count} modules (model + controller + route) for:`);
console.log(entities.map((e) => `  - ${e.key}`).join('\n'));

// Emit a routes manifest that server.js can import to auto-mount everything.
const manifestLines = entities
  .map(
    (e) =>
      `  { path: '/api/${e.key}', route: (await import('./${e.key}Routes.js')).default },`
  )
  .join('\n');

const manifest = `// AUTO-GENERATED by dev-tools/generate-crud.mjs - do not edit by hand.
// Imported by server.js to mount every generated CRUD module in one place.
export async function loadGeneratedRoutes() {
  return [
${manifestLines}
  ];
}
`;

fs.writeFileSync(path.join(routesDir, '_generatedRoutes.js'), manifest);
console.log('Wrote backend/routes/_generatedRoutes.js');
