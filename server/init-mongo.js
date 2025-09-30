// MongoDB initialization script
db = db.getSiblingDB('jobtracker');

// Create a user for the application
db.createUser({
  user: 'jobtracker',
  pwd: 'jobtracker123',
  roles: [
    {
      role: 'readWrite',
      db: 'jobtracker'
    }
  ]
});

// Create collections with validation
db.createCollection('jobs', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['position', 'company', 'salary', 'link', 'status'],
      properties: {
        position: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 100
        },
        company: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 100
        },
        salary: {
          bsonType: 'object',
          required: ['amount', 'currency'],
          properties: {
            amount: {
              bsonType: 'number',
              minimum: 0
            },
            currency: {
              bsonType: 'string',
              minLength: 3,
              maxLength: 3
            }
          }
        },
        link: {
          bsonType: 'string',
          pattern: '^https?://'
        },
        status: {
          bsonType: 'string',
          enum: ['applied', 'interviewing', 'offered', 'rejected', 'withdrawn', 'accepted']
        },
        type: {
          bsonType: 'string',
          enum: ['full_time', 'part_time', 'contract', 'intern', 'other']
        },
        priority: {
          bsonType: 'string',
          enum: ['low', 'medium', 'high']
        }
      }
    }
  }
});

// Create indexes for better performance
db.jobs.createIndex({ company: 1 });
db.jobs.createIndex({ status: 1 });
db.jobs.createIndex({ dateApplied: -1 });
db.jobs.createIndex({ priority: 1 });
db.jobs.createIndex({ createdAt: -1 });

print('Database initialization completed successfully!');




