/**
 * OpenAPI 3.1 Specification  —  lib/swagger.js
 * ==============================================
 * Single source of truth for every HTTP endpoint in Thabo.Portfolio.
 *
 * Routes documented here:
 *   GET  /api/profile              – Fetch owner profile from MongoDB
 *   PUT  /api/profile              – Update profile fields  (x-api-key required)
 *   GET  /api/experience           – Fetch experience entries
 *   POST /api/experience           – Add new experience (x-api-key required)
 *   GET  /api/projects             – Fetch all projects
 *   POST /api/projects             – Add new project (x-api-key required)
 *   GET  /api/skills               – Fetch all skills
 *   POST /api/skills               – Add new skill (x-api-key required)
 *   POST /api/upload               – Upload profile image to Cloudinary (x-api-key required)
 *   POST /api/contact              – Send contact form email
 *   GET  /api/swagger              – Return this spec as raw JSON
 *   GET  /api-docs                 – Render interactive Swagger UI (HTML page)
 *
 * Asset management:
 *   Profile Image → Cloudinary (uploaded via /api/upload)
 *   Resume        → Google Drive shareable link (stored as resumeUrl in profile)
 *
 * Consumed by:
 *   app/api/swagger/route.js  → served as JSON for Postman / tooling
 *   app/api-docs/route.js     → embedded in the Swagger UI HTML page
 */

const swaggerSpec = {
  openapi: '3.1.0',
  info: {
    title: 'Thabo Portfolio API',
    version: '2.0.0',
    description:
      'Complete REST API for **Thabo.Portfolio** — a Next.js 16 portfolio site.\n\n' +
      'Manages profile data, experience, projects, skills, contact form, and Cloudinary image uploads.\n\n' +
      '**Profile Image:** uploaded to Cloudinary via `POST /api/upload`.\n\n' +
      '**Resume:** stored as a Google Drive shareable link in the `resumeUrl` profile field.\n\n' +
      '**Authentication:** all write endpoints require the `x-api-key` header set to `ADMIN_API_KEY` from `.env`.\n\n' +
      '**Base URLs:**\n- Local: `http://localhost:3000`\n- Production: `https://thabo-portfolio.vercel.app`',
    contact: {
      name: 'Balachandran Thabotharan',
      email: 'balathabo96@gmail.com',
    },
  },

  servers: [
    {
      url: '/',
      description: 'Current Environment (Dynamic)',
    },
  ],

  tags: [
    {
      name: 'Profile',
      description: 'Read and update the single owner-profile document stored in MongoDB.',
    },
    {
      name: 'Experience',
      description: 'Manage work history and educational background.',
    },
    {
      name: 'Projects',
      description: 'Manage portfolio projects and technical case studies.',
    },

    {
      name: 'Contact',
      description: 'Accept contact form submissions and deliver them via Gmail SMTP (Nodemailer).',
    },
    {
      name: 'Docs',
      description: 'API documentation endpoints — the OpenAPI JSON spec and the Swagger UI page.',
    },
    {
      name: 'System',
      description: 'System-level operations like database seeding.',
    },
  ],

  paths: {

    /* ------------------------------------------------------------------ */
    /*  PROFILE                                                             */
    /* ------------------------------------------------------------------ */
    '/api/profile': {

      get: {
        operationId: 'getProfile',
        summary: 'Get owner profile',
        description:
          'Returns the single profile document from MongoDB.\n\n' +
          'If no document exists yet, an empty one is created automatically with default values ' +
          '(name, title, profileImageUrl). This endpoint is called server-side by the home page ' +
          'to pre-render the profile photo without a client-side flash.',
        tags: ['Profile'],
        responses: {
          200: {
            description: 'Profile document retrieved (or auto-created) successfully.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Profile' },
                example: {
                  _id: '6650e8f2c3d4b5e6f7a8b9c0',
                  profileImageUrl: '/images/portf.png',
                  name: 'Balachandran Thabotharan',
                  title: 'Infrastructure Engineer | IT Solutions Student | Cybersecurity Enthusiast',
                  bio: '',
                  createdAt: '2025-04-25T10:00:00.000Z',
                  updatedAt: '2025-04-25T10:00:00.000Z',
                },
              },
            },
          },
          500: {
            description: 'Database connection or query error.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: { error: 'connect ECONNREFUSED 127.0.0.1:27017' },
              },
            },
          },
        },
      },

      put: {
        operationId: 'updateProfile',
        summary: 'Update owner profile',
        description:
          'Partially updates the profile document.\n\n' +
          '**Security:** the `x-api-key` header must match `ADMIN_API_KEY` in `.env`. ' +
          'Any request with a missing or incorrect key is rejected with `401`.\n\n' +
          '**Whitelisted fields:** `firstName`, `lastName`, `title`, `role`, `bio`, `missionDescription`, `location`, `email`, `phone`, `linkedinUrl`, `githubUrl`, `profileImageUrl`, `resumeUrl`.\n\n' +
          'Uses `upsert: true` so the document is created if it does not yet exist.',
        tags: ['Profile'],
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProfileUpdate' },
            },
          },
        },
        responses: {
          200: {
            description: 'Profile updated and returned successfully.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Profile' },
              },
            },
          },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/experience': {
      get: {
        operationId: 'getExperience',
        summary: 'Get all experiences',
        description: 'Returns a list of work and education history sorted by order.',
        tags: ['Experience'],
        responses: {
          200: {
            description: 'List of experience documents.',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Experience' } } } }
          }
        }
      },
      post: {
        operationId: 'createExperience',
        summary: 'Create experience',
        description: 'Adds a new experience entry. Required auth: x-api-key.',
        tags: ['Experience'],
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ExperienceCreate' } } }
        },
        responses: {
          201: { description: 'Experience created.' },
          401: { description: 'Unauthorized.' }
        }
      },
      put: {
        operationId: 'updateExperience',
        summary: 'Update experience',
        description: 'Updates an existing experience entry. Required auth: x-api-key. Must include `_id` in body.',
        tags: ['Experience'],
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { allOf: [{ $ref: '#/components/schemas/Experience' }, { properties: { _id: { type: 'string' } }, required: ['_id'] }] } } }
        },
        responses: {
          200: { description: 'Experience updated.' },
          401: { description: 'Unauthorized.' }
        }
      },
      delete: {
        operationId: 'deleteExperience',
        summary: 'Delete experience',
        description: 'Deletes an experience entry by ID. Required auth: x-api-key.',
        tags: ['Experience'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [{ name: 'id', in: 'query', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Experience deleted.' },
          401: { description: 'Unauthorized.' }
        }
      }
    },
    '/api/projects': {
      get: {
        operationId: 'getProjects',
        summary: 'Get all projects',
        description: 'Returns a list of portfolio projects.',
        tags: ['Projects'],
        responses: {
          200: {
            description: 'List of project documents.',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Project' } } } }
          }
        }
      },
      post: {
        operationId: 'createProject',
        summary: 'Create project',
        description: 'Adds a new portfolio project. Required auth: x-api-key.',
        tags: ['Projects'],
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ProjectCreate' } } }
        },
        responses: {
          201: { description: 'Project created.' },
          401: { description: 'Unauthorized.' }
        }
      },
      put: {
        operationId: 'updateProject',
        summary: 'Update project',
        description: 'Updates an existing project. Required auth: x-api-key. Must include `_id` in body.',
        tags: ['Projects'],
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { allOf: [{ $ref: '#/components/schemas/Project' }, { properties: { _id: { type: 'string' } }, required: ['_id'] }] } } }
        },
        responses: {
          200: { description: 'Project updated.' },
          401: { description: 'Unauthorized.' }
        }
      },
      delete: {
        operationId: 'deleteProject',
        summary: 'Delete project',
        description: 'Deletes a project by ID. Required auth: x-api-key.',
        tags: ['Projects'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [{ name: 'id', in: 'query', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Project deleted.' },
          401: { description: 'Unauthorized.' }
        }
      }
    },



    /* ------------------------------------------------------------------ */
    /*  CONTACT                                                             */
    /* ------------------------------------------------------------------ */
    '/api/contact': {

      post: {
        operationId: 'submitContact',
        summary: 'Submit contact form',
        description:
          'Accepts a contact form message and delivers it to the portfolio owner ' +
          'via Gmail SMTP using Nodemailer.\n\n' +
          'The email is sent from `EMAIL_USER` (env) to `balathabo96@gmail.com` ' +
          'with both plain-text and HTML bodies.\n\n' +
          '**Required env vars:** `EMAIL_USER`, `EMAIL_PASS` (Gmail App Password).',
        tags: ['Contact'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ContactMessage' },
              example: {
                name: 'John Doe',
                email: 'john@example.com',
                subject: 'Collaboration opportunity',
                message: "I'd like to discuss a potential collaboration with you.",
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Email delivered successfully.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: { message: 'Email sent successfully' },
              },
            },
          },
          500: {
            description: 'Nodemailer / SMTP error — email was not delivered.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: { error: 'Failed to send email' },
              },
            },
          },
        },
      },
    },

    /* ------------------------------------------------------------------ */
    /*  DOCS                                                                */
    /* ------------------------------------------------------------------ */
    '/api/swagger': {

      get: {
        operationId: 'getSwaggerSpec',
        summary: 'Get OpenAPI JSON spec',
        description:
          'Returns the complete OpenAPI 3.0 specification as a JSON object. ' +
          'Use this URL to import the API into Postman, Insomnia, or any ' +
          'OpenAPI-compatible tool.',
        tags: ['Docs'],
        responses: {
          200: {
            description: 'OpenAPI 3.0 specification object.',
            content: {
              'application/json': {
                schema: { type: 'object' },
              },
            },
          },
        },
      },
    },

    '/api-docs': {

      get: {
        operationId: 'getSwaggerUI',
        summary: 'Swagger UI documentation page',
        description:
          'Returns a self-contained HTML page that renders the interactive Swagger UI. ' +
          'The OpenAPI spec is embedded directly so no additional request is needed. ' +
          'The page runs outside the Next.js React layout — Swagger UI owns the full viewport.',
        tags: ['Docs'],
        responses: {
          200: {
            description: 'Swagger UI HTML page.',
            content: { 'text/html': {} },
          },
        },
      },
    },
    '/api/upload': {
      post: {
        operationId: 'uploadImage',
        summary: 'Upload profile image to Cloudinary',
        description:
          'Accepts a multipart/form-data image upload and stores it on Cloudinary.\n\n' +
          'Uses a fixed `public_id` equal to the `field` parameter so re-uploading ' +
          'automatically overwrites the previous image and invalidates the CDN cache.\n\n' +
          '**Only image files are accepted.** For the resume, paste a Google Drive link ' +
          'directly into the `resumeUrl` field via `PUT /api/profile`.\n\n' +
          '**Required auth:** `x-api-key` header.',
        tags: ['Profile'],
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['file'],
                properties: {
                  file:  { type: 'string', format: 'binary', description: 'Image file to upload' },
                  field: { type: 'string', example: 'profileImageUrl', description: 'Field name used as the Cloudinary public_id' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Image uploaded successfully.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UploadResponse' } } },
          },
          401: { description: 'Unauthorized — missing or incorrect x-api-key.' },
          415: { description: 'Unsupported media type — only images are accepted.' },
          500: { description: 'Cloudinary upload error.' },
        },
      },
    },

    '/api/skills': {
      get: {
        operationId: 'getSkills',
        summary: 'Get all skills',
        description: 'Returns a list of all skills sorted by order.',
        tags: ['Skills'],
        responses: { 200: { description: 'List of skill documents.' } },
      },
      post: {
        operationId: 'createSkill',
        summary: 'Create skill',
        description: 'Adds a new skill entry. Required auth: x-api-key.',
        tags: ['Skills'],
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, icon: { type: 'string' }, category: { type: 'string' }, order: { type: 'number' } } } } }
        },
        responses: { 201: { description: 'Skill created.' }, 401: { description: 'Unauthorized.' } },
      },
      put: {
        operationId: 'updateSkill',
        summary: 'Update skill',
        description: 'Updates an existing skill. Required auth: x-api-key. Must include `_id` in body.',
        tags: ['Skills'],
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { _id: { type: 'string' }, name: { type: 'string' }, icon: { type: 'string' }, category: { type: 'string' }, order: { type: 'number' } }, required: ['_id'] } } }
        },
        responses: { 200: { description: 'Skill updated.' }, 401: { description: 'Unauthorized.' } },
      },
      delete: {
        operationId: 'deleteSkill',
        summary: 'Delete skill',
        description: 'Deletes a skill entry by ID. Required auth: x-api-key.',
        tags: ['Skills'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [{ name: 'id', in: 'query', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Skill deleted.' }, 401: { description: 'Unauthorized.' } },
      },
    },

    '/api/seed': {
      post: {
        operationId: 'seedDatabase',
        summary: 'Seed database',
        description: 'Resets and populates the database with professional demo data. Required auth: x-api-key.',
        tags: ['System'],
        security: [{ ApiKeyAuth: [] }],
        responses: {
          200: { description: 'Database seeded successfully.' },
          401: { description: 'Unauthorized.' }
        }
      }
    },

    '/api/analytics/resume': {
      post: {
        operationId: 'trackResumeDownload',
        summary: 'Track resume view click',
        description: 'Increments the resume download counter. Called automatically when the "View Resume" button is clicked.',
        tags: ['System'],
        responses: { 200: { description: 'Counter incremented.' } },
      },
      get: {
        operationId: 'getResumeAnalytics',
        summary: 'Get resume download count',
        description: 'Returns the total number of resume view clicks tracked.',
        tags: ['System'],
        responses: { 200: { description: 'Resume click count.' } },
      },
    },
  },

  /* -------------------------------------------------------------------- */
  /*  REUSABLE COMPONENTS                                                   */
  /* -------------------------------------------------------------------- */
  components: {

    schemas: {

      Profile: {
        type: 'object',
        description: 'Owner profile document stored in MongoDB (single document pattern).',
        properties: {
          _id:             { type: 'string',  description: 'MongoDB ObjectId',        example: '6650e8f2c3d4b5e6f7a8b9c0' },
          firstName:       { type: 'string',  description: 'First name',               example: 'Balachandran' },
          lastName:        { type: 'string',  description: 'Last name',                example: 'Thabotharan' },
          title:           { type: 'string',  description: 'Professional tagline',     example: 'Infrastructure Engineer | IT Solutions Professional' },
          role:            { type: 'string',  description: 'Current role',             example: 'Infrastructure Engineer' },
          bio:             { type: 'string',  description: 'Short biography',          example: 'Experienced IT professional...' },
          missionDescription: { type: 'string', example: 'My mission is to...' },
          location:        { type: 'string',  example: 'Scarborough, Ontario, Canada' },
          email:           { type: 'string',  example: 'balathabo96@gmail.com' },
          phone:           { type: 'string',  example: '(437) 383-1996' },
          linkedinUrl:     { type: 'string',  example: 'https://linkedin.com/...' },
          githubUrl:       { type: 'string',  example: 'https://github.com/...' },
          profileImageUrl: { type: 'string',  description: 'URL of the profile photo', example: 'https://res.cloudinary.com/...' },
          resumeUrl:       { type: 'string',  description: 'Google Drive resume link', example: 'https://drive.google.com/...' },
          createdAt:       { type: 'string',  format: 'date-time' },
          updatedAt:       { type: 'string',  format: 'date-time' },
        },
      },

      ProfileUpdate: {
        type: 'object',
        description:
          'Partial profile update payload. Only whitelisted fields are accepted — ' +
          'any other keys sent in the body are silently dropped.',
        properties: {
          firstName:        { type: 'string', example: 'Balachandran' },
          lastName:         { type: 'string', example: 'Thabotharan' },
          title:            { type: 'string', example: 'Infrastructure Engineer | IT Solutions Professional' },
          role:             { type: 'string', example: 'Infrastructure Engineer' },
          bio:              { type: 'string', example: 'Experienced IT professional.' },
          missionDescription: { type: 'string', example: 'My professional mission...' },
          location:         { type: 'string', example: 'Scarborough, Ontario, Canada' },
          email:            { type: 'string', example: 'balathabo96@gmail.com' },
          phone:            { type: 'string', example: '(437) 383-1996' },
          linkedinUrl:      { type: 'string', example: 'https://linkedin.com/in/...' },
          githubUrl:        { type: 'string', example: 'https://github.com/balathabo1996' },
          profileImageUrl:  { type: 'string', example: 'https://res.cloudinary.com/...' },
          resumeUrl:        { type: 'string', example: 'https://drive.google.com/file/d/.../view' },
        },
        minProperties: 1,
      },

      UploadResponse: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'Cloudinary secure URL of the uploaded image', example: 'https://res.cloudinary.com/dk4kvk0kw/image/upload/thabo-portfolio/profileImageUrl.png' },
        },
      },

      ContactMessage: {
        type: 'object',
        description: 'Contact form payload forwarded as an email via Nodemailer.',
        required: ['name', 'email', 'subject', 'message'],
        properties: {
          name:    { type: 'string', description: "Sender's full name",      example: 'John Doe' },
          email:   { type: 'string', format: 'email', description: "Sender's email address", example: 'john@example.com' },
          subject: { type: 'string', description: 'Email subject line',      example: 'Collaboration opportunity' },
          message: { type: 'string', description: 'Message body (min 10 chars)', minLength: 10, example: "I'd like to discuss a potential collaboration." },
        },
      },

      SuccessResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Email sent successfully' },
        },
      },

      ErrorResponse: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Something went wrong' },
        },
      },

      Experience: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          role: { type: 'string' },
          company: { type: 'string' },
          location: { type: 'string' },
          period: { type: 'string' },
          type: { type: 'string', enum: ['work', 'education', 'achievement', 'voluntary'] },
          order: { type: 'number' }
        }
      },

      ExperienceCreate: {
        type: 'object',
        required: ['role', 'company'],
        properties: {
          role: { type: 'string' },
          company: { type: 'string' },
          location: { type: 'string' },
          period: { type: 'string' },
          type: { type: 'string', enum: ['work', 'education', 'achievement', 'voluntary'] },
          order: { type: 'number' }
        }
      },

      Project: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          imageUrl: { type: 'string' },
          features: { type: 'array', items: { type: 'string' } },
          techStack: { type: 'array', items: { type: 'string' } },
          order: { type: 'number' }
        }
      },

      ProjectCreate: {
        type: 'object',
        required: ['title', 'description'],
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          imageUrl: { type: 'string' },
          features: { type: 'array', items: { type: 'string' } },
          techStack: { type: 'array', items: { type: 'string' } },
          order: { type: 'number' }
        }
      },
    },


    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'x-api-key',
        description:
          'API key required for write operations. ' +
          'Set to the value of `ADMIN_API_KEY` in your `.env` file.',
      },
    },
  },
};

export default swaggerSpec;
