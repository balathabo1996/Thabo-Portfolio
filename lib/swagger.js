/**
 * OpenAPI 3.0 Specification  —  lib/swagger.js
 * ==============================================
 * Single source of truth for every HTTP endpoint in Thabo.Portfolio.
 *
 * All 6 routes are documented here:
 *   GET  /api/profile   – Fetch owner profile from MongoDB
 *   PUT  /api/profile   – Update profile fields  (x-api-key required)
 *   GET  /resume        – Stream resume PDF from MongoDB
 *   POST /api/contact   – Send contact form email via Nodemailer + Gmail
 *   GET  /api/swagger   – Return this spec as raw JSON
 *   GET  /api-docs      – Render interactive Swagger UI (HTML page)
 *
 * Consumed by:
 *   app/api/swagger/route.js  → served as JSON for Postman / tooling
 *   app/api-docs/route.js     → embedded in the Swagger UI HTML page
 */

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Thabo Portfolio API',
    version: '1.0.0',
    description:
      'Complete REST API for **Thabo.Portfolio** — a Next.js 15 portfolio site.\n\n' +
      'Manages profile data, resume PDF delivery, contact form emails, and API documentation.\n\n' +
      '**Authentication:** `PUT /api/profile` requires the `x-api-key` header set to `ADMIN_API_KEY` from `.env`.\n\n' +
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
      name: 'Resume',
      description: 'Stream the resume PDF binary stored in MongoDB directly to the browser.',
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
          '**Mass-assignment protection:** only the whitelisted fields ' +
          '(`profileImageUrl`, `bio`, `name`, `role`, `location`, `email`, `phone`) ' +
          'are written — all other keys in the request body are silently ignored.\n\n' +
          'Uses `upsert: true` so the document is created if it does not yet exist.',
        tags: ['Profile'],
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProfileUpdate' },
              example: {
                profileImageUrl: 'https://example.com/photo.jpg',
                name: 'Balachandran Thabotharan',
                role: 'Infrastructure Engineer',
                bio: 'Experienced IT professional specialising in infrastructure and cybersecurity.',
                location: 'Scarborough, Ontario, Canada',
                email: 'balathabo96@gmail.com',
                phone: '+1 (437) 383-1996',
              },
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
          400: {
            description: 'Request body contained no recognised (whitelisted) fields.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: { error: 'No valid fields provided' },
              },
            },
          },
          401: {
            description: 'Missing or incorrect `x-api-key` header.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: { error: 'Unauthorized' },
              },
            },
          },
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
      }
    },


    /* ------------------------------------------------------------------ */
    /*  RESUME                                                              */
    /* ------------------------------------------------------------------ */
    '/resume': {

      get: {
        operationId: 'getResume',
        summary: 'Stream resume PDF',
        description:
          'Queries the `Resume` collection for the most recently uploaded document ' +
          '(sorted by `uploadDate` descending) and streams the raw binary PDF buffer.\n\n' +
          '`Content-Disposition: inline` causes modern browsers to open the file ' +
          'in their built-in PDF viewer rather than prompting a download.',
        tags: ['Resume'],
        responses: {
          200: {
            description: 'PDF binary stream delivered inline.',
            headers: {
              'Content-Type': {
                schema: { type: 'string', example: 'application/pdf' },
              },
              'Content-Disposition': {
                schema: { type: 'string', example: 'inline; filename="resume.pdf"' },
              },
            },
            content: { 'application/pdf': {} },
          },
          404: {
            description: 'No resume document found in the database.',
            content: {
              'text/plain': {
                schema: { type: 'string', example: 'Resume not found' },
              },
            },
          },
          500: {
            description: 'Database connection or query error.',
            content: {
              'text/plain': {
                schema: { type: 'string', example: 'Internal server error' },
              },
            },
          },
        },
      },
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
    '/api/seed': {
      post: {
        operationId: 'seedDatabase',
        summary: 'Seed database',
        description: 'Resets and populates the database with default data. Required auth: x-api-key.',
        tags: ['System'],
        security: [{ ApiKeyAuth: [] }],
        responses: {
          200: { description: 'Database seeded successfully.' },
          401: { description: 'Unauthorized.' }
        }
      }
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
          profileImageUrl: { type: 'string',  description: 'URL of the profile photo', example: '/images/portf.png' },
          name:            { type: 'string',  description: 'Full display name',        example: 'Balachandran Thabotharan' },
          title:           { type: 'string',  description: 'Professional tagline',     example: 'Infrastructure Engineer | IT Solutions Student' },
          bio:             { type: 'string',  description: 'Short biography',          example: '' },
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
          profileImageUrl: { type: 'string', example: 'https://example.com/photo.jpg' },
          name:            { type: 'string', example: 'Balachandran Thabotharan' },
          role:            { type: 'string', example: 'Infrastructure Engineer' },
          bio:             { type: 'string', example: 'Experienced IT professional.' },
          location:        { type: 'string', example: 'Scarborough, Ontario, Canada' },
          email:           { type: 'string', example: 'balathabo96@gmail.com' },
          phone:           { type: 'string', example: '+1 (437) 383-1996' },
        },
        minProperties: 1,
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
