# Firebase Security Specification (TDD SPEC)

## 1. Data Invariants
- A User, Note, or Task document must never be writeable by unauthenticated requests.
- A user can only read and write their own profile (`/users/{userId}`), their own notes (`/users/{userId}/notes/{noteId}`), and their own tasks (`/users/{userId}/tasks/{taskId}`).
- Document IDs must conform to alphanumeric constraints and be reasonably sized (< 128 characters) to prevent database resource exhaustion.
- The `userId` property inside any created sub-resource must strictly align with the `request.auth.uid`.
- Timestamp fields must be secure server-controlled `request.time` instances instead of arbitrary client-defined strings.

## 2. Threat Vector Payload Models (The Dirty Dozen)

1. **Unauthenticated User Profile Injection**: Attempt to create a user profile document to `/users/any-user-id` without any auth credentials.
2. **Identity Spoofing on User Profile**: Authenticated as `user_A`, attempting to write to `/users/user_B`.
3. **Malicious Email/Privilege Injection**: Attempting to write a user profile with high privilege or spoofed verified status attributes.
4. **Foreign Note Read**: User `user_A` attempting to read a note in path `/users/user_B/notes/note_1`.
5. **Foreign Note Write**: User `user_A` attempting to write a note to `/users/user_B/notes/note_1`.
6. **Note ID Poisoning**: Attempting to create a note with a 50KB symbol-laden string as the note ID.
7. **Foreign Task Read**: User `user_A` attempting to read a task in `/users/user_B/tasks/task_1`.
8. **Foreign Task Write**: User `user_A` attempting to write a task in `/users/user_B/tasks/task_1`.
9. **Task Identity Spoofing**: Sending a task payload with `userId: "user_B"` while authenticated as `user_A` to `/users/user_A/tasks/task_1`.
10. **Note Timestamp Forgery**: Sending a note document where `createdAt` is a hardcoded static timestamp from 2020 instead of the live server timestamp.
11. **Task Value Poisoning**: Trying to update a task's priority to an invalid value (e.g., `ULTRA_HIGH`).
12. **Task State Shortcutting**: Authenticated as user `user_A`, attempting to bulk delete/overwrite elements in multiple users' task registries simultaneously without atomic guards.
