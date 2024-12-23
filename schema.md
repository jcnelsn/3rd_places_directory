# 3rd Places - Data Schema

## Event Object Structure
```javascript
{
id: string, // Timestamp-based unique identifier
title: string, // Name of the event
description: string, // Details about the event
location: string, // Physical location in Honolulu
startTime: string, // Start datetime (ISO format)
endTime: string, // End datetime (ISO format)
upvotes: number, // Number of upvotes (default: 0)
timestamp: string // Creation time (ISO format)
}
```

## Local Storage Implementation
- Storage Key: 'events'
- Storage Value: JSON string of Event[] array
- Example:
```javascript
localStorage.setItem('events', JSON.stringify([
{
id: "1679529600000",
title: "Coffee Tasting Workshop",
description: "Learn about different coffee brewing methods",
location: "Morning Glass Coffee",
startTime: "2024-03-22T10:00:00",
endTime: "2024-03-22T12:00:00",
upvotes: 5,
timestamp: "2024-03-15T08:00:00Z"
},
// ... more events
]));
```

## Data Operations

### Create
- Generate new ID using `Date.now()`
- Set initial upvotes to 0
- Add to events array
- Update localStorage

### Read
- Parse events from localStorage
- Sort by upvotes (descending)
- Format dates for display

### Update (Upvote)
- Find event by ID
- Increment upvote count
- Update localStorage

### Delete
- Not implemented in Phase 1
- Consider for future iterations

## Data Constraints
- Title: Required
- Description: Required
- Location: Required
- Start Time: Required, must be valid date
- End Time: Required, must be valid date
- Upvotes: Number, minimum 0
- ID: Unique, auto-generated
- Timestamp: Auto-generated on creation

## Future Considerations
1. Server Migration
   - Schema ready for database implementation
   - Easy transition to PostgreSQL
2. Additional Fields
   - Event categories/tags
   - Event images
   - Organizer contact info
3. Data Validation
   - End time after start time
   - Location validation
   - Duplicate event detection