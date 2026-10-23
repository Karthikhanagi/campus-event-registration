const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { isMongoActive, dataFilePath } = require('../config/db');
const { MongooseUser, MongooseEvent, MongooseRegistration } = require('./schemas');

// Helper to generate 24-hex MongoDB-like ObjectIds
function generateId() {
  return crypto.randomBytes(12).toString('hex');
}

// Helpers for file-based DB
function loadFileData() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      const initial = { users: [], events: [], registrations: [] };
      fs.writeFileSync(dataFilePath, JSON.stringify(initial, null, 2));
      return initial;
    }
    const raw = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return { users: [], events: [], registrations: [] };
  }
}

function saveFileData(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error saving db.json:', err);
  }
}

// Unified User model
const User = {
  findOne: async (filter) => {
    if (isMongoActive()) {
      return await MongooseUser.findOne(filter);
    }
    const db = loadFileData();
    return db.users.find(u => {
      for (const key in filter) {
        if (filter[key] instanceof RegExp) {
          if (!filter[key].test(u[key])) return false;
        } else if (u[key] !== filter[key]) {
          return false;
        }
      }
      return true;
    }) || null;
  },
  create: async (doc) => {
    if (isMongoActive()) {
      return await MongooseUser.create(doc);
    }
    const db = loadFileData();
    const newUser = {
      _id: generateId(),
      uid: doc.uid || generateId(),
      name: doc.name,
      email: doc.email.toLowerCase().trim(),
      role: doc.role || 'student',
      createdAt: new Date()
    };
    db.users.push(newUser);
    saveFileData(db);
    return newUser;
  },
  findOneAndUpdate: async (filter, update, options = {}) => {
    if (isMongoActive()) {
      return await MongooseUser.findOneAndUpdate(filter, update, options);
    }
    const db = loadFileData();
    const index = db.users.findIndex(u => {
      for (const key in filter) {
        if (u[key] !== filter[key]) return false;
      }
      return true;
    });
    if (index === -1) {
      if (options.upsert) {
        const newUser = {
          _id: generateId(),
          ...filter,
          ...(update.$set || update),
          createdAt: new Date()
        };
        db.users.push(newUser);
        saveFileData(db);
        return newUser;
      }
      return null;
    }
    db.users[index] = { ...db.users[index], ...(update.$set || update) };
    saveFileData(db);
    return db.users[index];
  },
  find: async (filter = {}) => {
    if (isMongoActive()) {
      return await MongooseUser.find(filter);
    }
    const db = loadFileData();
    return db.users;
  }
};

// Unified Event model
const Event = {
  find: async (filter = {}) => {
    if (isMongoActive()) {
      return await MongooseEvent.find(filter).sort({ date: 1 });
    }
    const db = loadFileData();
    let results = [...db.events];

    if (filter.category) {
      results = results.filter(e => e.category.toLowerCase() === filter.category.toLowerCase());
    }
    if (filter.$or) {
      // Search across title, description, venue
      results = results.filter(e => {
        return filter.$or.some(clause => {
          for (const key in clause) {
            if (clause[key] instanceof RegExp) {
              return clause[key].test(e[key]);
            }
          }
          return false;
        });
      });
    }
    if (filter.date && filter.date.$gte) {
      results = results.filter(e => e.date >= filter.date.$gte);
    }

    // Sort by date ascending
    return results.sort((a, b) => (a.date + ' ' + a.time).localeCompare(b.date + ' ' + b.time));
  },
  findById: async (id) => {
    if (isMongoActive()) {
      return await MongooseEvent.findById(id);
    }
    const db = loadFileData();
    return db.events.find(e => String(e._id) === String(id)) || null;
  },
  create: async (doc) => {
    if (isMongoActive()) {
      return await MongooseEvent.create(doc);
    }
    const db = loadFileData();
    const newEvent = {
      _id: generateId(),
      title: doc.title.trim(),
      description: doc.description,
      category: doc.category,
      date: doc.date,
      time: doc.time,
      venue: doc.venue,
      capacity: Number(doc.capacity),
      imageUrl: doc.imageUrl || '',
      createdBy: doc.createdBy || 'admin',
      createdAt: new Date().toISOString()
    };
    db.events.push(newEvent);
    saveFileData(db);
    return newEvent;
  },
  findByIdAndUpdate: async (id, update, options = {}) => {
    if (isMongoActive()) {
      return await MongooseEvent.findByIdAndUpdate(id, update, options);
    }
    const db = loadFileData();
    const index = db.events.findIndex(e => String(e._id) === String(id));
    if (index === -1) return null;
    db.events[index] = { ...db.events[index], ...update };
    saveFileData(db);
    return db.events[index];
  },
  findByIdAndDelete: async (id) => {
    if (isMongoActive()) {
      return await MongooseEvent.findByIdAndDelete(id);
    }
    const db = loadFileData();
    const index = db.events.findIndex(e => String(e._id) === String(id));
    if (index === -1) return null;
    const removed = db.events.splice(index, 1)[0];
    saveFileData(db);
    return removed;
  },
  countDocuments: async (filter = {}) => {
    if (isMongoActive()) {
      return await MongooseEvent.countDocuments(filter);
    }
    const db = loadFileData();
    if (filter.date && filter.date.$gte) {
      return db.events.filter(e => e.date >= filter.date.$gte).length;
    }
    return db.events.length;
  }
};

// Unified Registration model
const Registration = {
  find: async (filter = {}) => {
    if (isMongoActive()) {
      return await MongooseRegistration.find(filter).populate('eventId');
    }
    const db = loadFileData();
    let list = db.registrations.filter(r => {
      for (const key in filter) {
        if (String(r[key]) !== String(filter[key])) return false;
      }
      return true;
    });

    // Populate eventId details
    return list.map(r => {
      const event = db.events.find(e => String(e._id) === String(r.eventId));
      return {
        ...r,
        eventId: event || r.eventId
      };
    });
  },
  findOne: async (filter) => {
    if (isMongoActive()) {
      return await MongooseRegistration.findOne(filter);
    }
    const db = loadFileData();
    return db.registrations.find(r => {
      for (const key in filter) {
        if (String(r[key]) !== String(filter[key])) return false;
      }
      return true;
    }) || null;
  },
  create: async (doc) => {
    if (isMongoActive()) {
      return await MongooseRegistration.create(doc);
    }
    const db = loadFileData();
    const newReg = {
      _id: generateId(),
      eventId: String(doc.eventId),
      userId: String(doc.userId),
      registeredAt: new Date().toISOString(),
      ticketId: doc.ticketId || `TKT-${generateId().substring(0, 8).toUpperCase()}`
    };
    db.registrations.push(newReg);
    saveFileData(db);
    return newReg;
  },
  findByIdAndDelete: async (id) => {
    if (isMongoActive()) {
      return await MongooseRegistration.findByIdAndDelete(id);
    }
    const db = loadFileData();
    const index = db.registrations.findIndex(r => String(r._id) === String(id));
    if (index === -1) return null;
    const removed = db.registrations.splice(index, 1)[0];
    saveFileData(db);
    return removed;
  },
  deleteMany: async (filter = {}) => {
    if (isMongoActive()) {
      return await MongooseRegistration.deleteMany(filter);
    }
    const db = loadFileData();
    const prevCount = db.registrations.length;
    db.registrations = db.registrations.filter(r => {
      for (const key in filter) {
        if (String(r[key]) === String(filter[key])) return false;
      }
      return true;
    });
    saveFileData(db);
    return { deletedCount: prevCount - db.registrations.length };
  },
  countDocuments: async (filter = {}) => {
    if (isMongoActive()) {
      return await MongooseRegistration.countDocuments(filter);
    }
    const db = loadFileData();
    return db.registrations.filter(r => {
      if (filter.eventId && String(r.eventId) !== String(filter.eventId)) return false;
      if (filter.userId && String(r.userId) !== String(filter.userId)) return false;
      if (filter.registeredAt && filter.registeredAt.$gte) {
        const regDate = new Date(r.registeredAt);
        const gteDate = new Date(filter.registeredAt.$gte);
        if (regDate < gteDate) return false;
      }
      return true;
    }).length;
  }
};

module.exports = {
  User,
  Event,
  Registration,
  generateId,
  loadFileData,
  saveFileData
};
