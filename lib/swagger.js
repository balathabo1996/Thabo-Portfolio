/** OpenAPI source of truth. Describes the route handlers, not generated JSDoc. */
const ref = name => ({ $ref: `#/components/schemas/${name}` });
const string = (example, description) => ({ type: 'string', ...(example !== undefined && { example }), ...(description && { description }) });
const array = items => ({ type: 'array', items });
const json = schema => ({ 'application/json': { schema } });
const body = schema => ({ required: true, content: json(schema) });
const response = (description, schema) => ({ description, content: json(schema) });
const admin = [{ AdminToken: [] }];
const id = { type: 'string', example: '6650e8f2c3d4b5e6f7a8b9c0', description: 'MongoDB ObjectId' };
const timestamps = { _id: { ...id, readOnly: true }, createdAt: { type: 'string', format: 'date-time', readOnly: true }, updatedAt: { type: 'string', format: 'date-time', readOnly: true } };
const publication = { order: { type: 'number', default: 0 }, status: { type: 'string', enum: ['published', 'draft'], default: 'published' } };
const profile = Object.fromEntries(['profileImageUrl', 'bio', 'firstName', 'lastName', 'role', 'title', 'location', 'email', 'phone', 'linkedinUrl', 'githubUrl', 'tagline', 'heroDescription', 'resumeUrl', 'missionTitle', 'missionDescription'].map(name => [name, string()]));
Object.assign(profile, { firstName: string('Balachandran'), lastName: string('Thabotharan'), role: string('Infrastructure Engineer'), email: { type: 'string', format: 'email', example: 'hello@example.com' }, resumeUrl: string('https://drive.google.com/file/d/FILE_ID/view') });
const project = { title: string('Infrastructure monitoring dashboard'), subTitle: string('Centralized service visibility'), description: string('A dashboard for monitoring system health and service availability.'), imageUrl: string('/images/placeholder.png'), period: string('2026'), award: string(), features: array(string()), techStack: array(string()), link: string('https://example.com'), category: { ...string('infra'), default: 'web' }, ...publication };
const experience = { role: string('Infrastructure Engineer'), company: string('Example organization'), companyUrl: string('https://example.com'), location: string('Toronto, Ontario'), period: string('2024 – Present'), description: array(string()), type: { type: 'string', enum: ['work', 'education', 'achievement', 'voluntary'], default: 'work' }, ...publication };
const skill = { name: string('Active Directory'), category: string('infra', 'Category key, for example infra, virt, prog, db, sec, or soft. The database does not enforce an enum.'), icon: string('fas fa-server'), imageUrl: string(), ...publication };
const schemas = {
  Error: { type: 'object', properties: { error: string('Something went wrong'), success: { type: 'boolean', example: false } }, required: ['error'] },
  Success: { type: 'object', properties: { success: { type: 'boolean', example: true } }, required: ['success'] },
  Message: { type: 'object', properties: { message: string('Operation completed') }, required: ['message'] },
  Profile: { type: 'object', properties: { ...timestamps, ...profile } },
  ProfileUpdate: { type: 'object', properties: profile, minProperties: 1, additionalProperties: false, description: 'Send one or more supported fields. Unsupported keys are silently discarded by the handler.' },
  Reorder: { type: 'object', required: ['items'], properties: { items: array({ type: 'object', required: ['_id', 'order'], properties: { _id: id, order: { type: 'number', example: 0 } } }) }, example: { items: [{ _id: '6650e8f2c3d4b5e6f7a8b9c0', order: 0 }] } },
  Login: { type: 'object', required: ['key'], properties: { key: string('YOUR_ADMIN_PASSPHRASE', 'The ADMIN_API_KEY configured on the server. Never use a real credential as a saved example.') } },
  LoginResponse: { type: 'object', required: ['success', 'token'], properties: { success: { type: 'boolean', example: true }, token: string('eyJ…', 'HS256 admin JWT, valid for eight hours. Send the raw token in x-api-key, without a Bearer prefix.') } },
  ContactMessage: { type: 'object', required: ['name', 'email', 'subject', 'message'], description: 'Expected contact-form fields. Required fields, email syntax, and a 10-character message minimum are currently enforced by the frontend; the server does not duplicate those checks.', properties: { name: string('Alex Example'), email: { type: 'string', format: 'email', example: 'alex@example.com' }, subject: string('Project enquiry'), message: string('I would like to discuss an infrastructure project.'), honeypot: { ...string(''), description: 'Leave empty. A nonempty value causes the server to silently discard the message and return success.' } } },
  Count: { type: 'object', required: ['count'], properties: { count: { type: 'number', example: 12 } } },
  ResumeTracked: { type: 'object', required: ['success', 'count'], properties: { success: { type: 'boolean', example: true }, count: { type: 'number', example: 13 } } },
  Statistics: { type: 'object', properties: Object.fromEntries(['totalProjects', 'publishedProjects', 'draftProjects', 'totalExperience', 'draftExperience', 'totalSkills', 'draftSkills', 'resumeDownloads'].map(key => [key, { type: 'number', example: 3 }])) },
  MediaResource: { type: 'object', additionalProperties: true, properties: { public_id: string('thabo-portfolio/general_1234567890'), secure_url: { type: 'string', format: 'uri' }, format: string('png'), width: { type: 'integer' }, height: { type: 'integer' }, bytes: { type: 'integer' }, created_at: { type: 'string', format: 'date-time' }, resource_type: string('image') } },
  MediaList: { type: 'object', properties: { resources: array(ref('MediaResource')) } },
  MediaDelete: { type: 'object', required: ['public_id'], properties: { public_id: string('thabo-portfolio/general_1234567890') } },
  Upload: { type: 'object', required: ['file'], properties: { file: { type: 'string', format: 'binary', description: 'Image file with an image/* MIME type. PDFs are not supported.' }, field: { type: 'string', default: 'general', example: 'project', description: 'Used in the Cloudinary public ID: field_timestamp, inside thabo-portfolio.' } } },
  UploadResponse: { type: 'object', properties: { url: { type: 'string', format: 'uri', example: 'https://res.cloudinary.com/example/image/upload/thabo-portfolio/project_123.png' } } },
  Backup: { type: 'object', properties: { exportedAt: { type: 'string', format: 'date-time' }, version: { type: 'string', example: '1.0' }, data: { type: 'object', properties: { profile: { anyOf: [ref('Profile'), { type: 'null' }] }, projects: array(ref('Project')), experiences: array(ref('Experience')), skills: array(ref('Skill')) } } } },
};
for (const [name, properties, required] of [['Project', project, ['title', 'description']], ['Experience', experience, ['role', 'company']], ['Skill', skill, ['name', 'category']]]) {
  schemas[name] = { type: 'object', properties: { ...timestamps, ...properties } };
  schemas[`${name}Create`] = { type: 'object', properties, required };
  schemas[`${name}Update`] = { type: 'object', properties: { _id: id, ...properties }, required: ['_id'] };
}
const error = description => response(description, ref('Error'));
function operation(operationId, tag, summary, schema, { protected: secured = false, status = 200, description = '', request, parameters, errors = [], mediaType } = {}) {
  const responses = { [status]: mediaType ? { description: 'Successful response', content: { [mediaType]: { schema } } } : response('Successful response', schema), ...(secured && { 401: error('Missing, invalid, expired, or non-admin JWT; also returned when JWT_SECRET is missing or too short.') }), ...Object.fromEntries(errors.map(([code, text]) => [code, error(text)])), 500: error('Server, database, or upstream service error.') };
  return { operationId, tags: [tag], summary, description, security: secured ? admin : [], ...(request && { requestBody: request }), ...(parameters && { parameters }), responses };
}
const paths = {};
for (const [path, name, tag, filter] of [['/api/projects', 'Project', 'Projects', true], ['/api/experience', 'Experience', 'Experience', true], ['/api/skills', 'Skill', 'Skills', false]]) {
  paths[path] = {
    get: operation(`list${name}`, tag, `List ${tag.toLowerCase()}`, array(ref(name)), { description: filter ? 'Sorted by order ascending. Drafts are excluded by default. all=true includes drafts; this query is currently public and is not an authorization boundary.' : 'Returns every skill, including drafts, sorted by order ascending. The homepage separately excludes drafts.', ...(filter && { parameters: [{ name: 'all', in: 'query', description: 'Include draft records. Currently available without authentication.', schema: { type: 'boolean', default: false } }] }) }),
    post: operation(`create${name}`, tag, `Create ${name.toLowerCase()}`, ref(name), { protected: true, status: 201, request: body(ref(`${name}Create`)), description: 'Mongoose creation failures, including schema validation failures, currently return 500.' }),
    put: operation(`update${name}`, tag, `Update ${name.toLowerCase()} by ID`, { anyOf: [ref(name), { type: 'null' }] }, { protected: true, request: body(ref(`${name}Update`)), errors: [[400, 'The _id field is missing.']], description: 'Partial update identified by body._id. Returns null with status 200 when the ID does not match a record; update validation is not explicitly enabled in the handler.' }),
    patch: operation(`reorder${name}`, tag, `Reorder ${tag.toLowerCase()}`, ref('Success'), { protected: true, request: body(ref('Reorder')), errors: [[400, 'items must be an array.']], description: 'Bulk updates each item’s order. This changes persisted data.' }),
    delete: operation(`delete${name}`, tag, `Delete ${name.toLowerCase()} by ID`, ref('Message'), { protected: true, parameters: [{ name: 'id', in: 'query', required: true, schema: id }], errors: [[400, 'The id query parameter is missing.']], description: 'Deletes by query parameter, not request body. Returns success even when no record matches.' }),
  };
}
paths['/api/profile'] = {
  get: operation('getProfile', 'Profile', 'Get owner profile', ref('Profile'), { description: 'Returns the first profile document. If none exists, an empty document is created; no identity defaults are seeded.' }),
  put: operation('updateProfile', 'Profile', 'Update owner profile', ref('Profile'), { protected: true, request: body(ref('ProfileUpdate')), errors: [[400, 'No supported profile fields were supplied.']], description: 'Updates the first profile or creates it if missing. Only documented profile fields are retained. The current homepage portrait uses a local cutout rather than profileImageUrl.' }),
};
paths['/api/auth/verify'] = { post: operation('loginAdmin', 'Authentication', 'Exchange admin passphrase for a JWT', ref('LoginResponse'), { request: body(ref('Login')), description: 'Public login endpoint. Submit ADMIN_API_KEY as key. Copy the returned token into Authorize; use the raw JWT, without Bearer. Tokens expire after eight hours. JWT_SECRET must be at least 32 characters.', errors: [[401, 'Incorrect, empty, or missing passphrase.'], [503, 'ADMIN_API_KEY is not configured.']] }) };
paths['/api/contact'] = { post: operation('sendContactMessage', 'Contact', 'Send a contact email', ref('Message'), { request: body(ref('ContactMessage')), description: 'Public email submission through Gmail SMTP. Limited to five requests per IP per ten minutes, using an in-memory map scoped to each server instance. A filled honeypot returns success without sending email. Requests really send email; use a controlled address and content.', errors: [[429, 'Rate limit exceeded; try again after the ten-minute window.']] }) };
paths['/api/upload'] = { post: operation('uploadImage', 'Media', 'Upload an image to Cloudinary', ref('UploadResponse'), { protected: true, request: { required: true, content: { 'multipart/form-data': { schema: ref('Upload') } } }, errors: [[400, 'No file part was supplied.'], [415, 'The file MIME type does not start with image/.']], description: 'Uses field_timestamp as public ID under thabo-portfolio. Returns the secure image URL. Resume documents use links instead of this endpoint.' }) };
paths['/api/media'] = {
  get: operation('listMedia', 'Media', 'List Cloudinary assets', ref('MediaList'), { description: 'Currently public. Returns up to 100 uploaded resources with prefix thabo-portfolio; no pagination parameter is exposed.' }),
  delete: operation('deleteMedia', 'Media', 'Delete a Cloudinary asset', ref('Success'), { protected: true, request: body(ref('MediaDelete')), errors: [[400, 'public_id is missing.']], description: 'Deletes the supplied public ID. Unlike collection DELETE routes, this endpoint expects JSON in the request body.' }),
};
paths['/api/analytics/resume'] = {
  get: operation('getResumeCount', 'Analytics', 'Read resume click count', ref('Count'), { description: 'Public. Returns zero when no counter exists.' }),
  post: operation('trackResumeClick', 'Analytics', 'Record a resume click', ref('ResumeTracked'), { description: 'Public write exception: increments resume_download and creates the counter if needed. No request body. This measures clicks, not completed downloads.' }),
};
paths['/api/stats'] = { get: operation('getStatistics', 'Analytics', 'Read dashboard statistics', ref('Statistics'), { description: 'Currently public. Returns project, experience, and skill counts, including draft counts, plus resume click totals.' }) };
paths['/api/backup'] = { get: operation('exportBackup', 'Backup', 'Export portfolio content as JSON', ref('Backup'), { protected: true, description: 'Downloads a snapshot of profile, projects, experiences, and skills, including drafts. Analytics and Cloudinary file contents are not included. There is no restore/import endpoint.' }) };
paths['/api/backup'].get.responses[200].headers = { 'Content-Disposition': { description: 'Download filename with export date.', schema: { type: 'string', example: 'attachment; filename="portfolio-backup-2026-11-10.json"' } } };
paths['/api/swagger'] = { get: { operationId: 'getOpenApi', tags: ['Documentation'], summary: 'Download the OpenAPI document', security: [], responses: { 200: response('OpenAPI 3.1 JSON document.', { type: 'object', additionalProperties: true }) } } };
paths['/api-docs'] = { get: { operationId: 'getApiDocs', tags: ['Documentation'], summary: 'Open the interactive API explorer', security: [], responses: { 200: { description: 'Branded Swagger UI HTML. JavaScript and the Swagger UI CDN are required for interactive exploration.', content: { 'text/html': { schema: { type: 'string' } } } } } } };

const swaggerSpec = {
  openapi: '3.1.0',
  info: { title: 'Thabo Portfolio API', version: '2.1.0', description: 'Content, media, analytics, and communication services for Thabo.Portfolio.\n\n**Authentication:** POST `/api/auth/verify` with `{ "key": "YOUR_ADMIN_PASSPHRASE" }`, then send the returned JWT in `x-api-key` (no Bearer prefix). Administrative writes and backup export require this token. Contact submission and resume click tracking are public write exceptions.\n\nExamples are illustrative. Try it out sends real requests to the current site.', contact: { name: 'Balachandran Thabotharan', url: 'https://thabo-portfolio.vercel.app' } },
  servers: [{ url: '/', description: 'Current origin — local or deployed site' }],
  tags: [['Authentication', 'Login and admin token exchange.'], ['Profile', 'Owner identity and profile configuration.'], ['Projects', 'Project content and display order.'], ['Experience', 'Work, education, achievements, and volunteering.'], ['Skills', 'Technical skills and categories.'], ['Media', 'Cloudinary image upload and asset management.'], ['Contact', 'Public contact email delivery.'], ['Analytics', 'Public counts and resume click tracking.'], ['Backup', 'Authenticated content export.'], ['Documentation', 'API reference and machine-readable specification.']].map(([name, description]) => ({ name, description })),
  paths,
  components: { schemas, securitySchemes: { AdminToken: { type: 'apiKey', in: 'header', name: 'x-api-key', description: 'Paste the raw JWT returned by POST /api/auth/verify. Do not paste ADMIN_API_KEY and do not add Bearer. Token lifetime: 8 hours.' } } },
};
export default swaggerSpec;
