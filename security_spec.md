# HelpHub AI Security Specification

## Data Invariants
1. A user can only modify their own profile data.
2. A user cannot change their own `role` or `trustScore` through the client SDK.
3. A help request can only be created by an authenticated user.
4. Only the author of a request can update its description or title.
5. Once a request status is marked as 'Solved', it is immutable for standard users.
6. Messages must be sent by the authenticated user and must belong to an existing channel.
7. Notifications are private to the recipient.

## The Dirty Dozen (Attack Payloads)

1. **Self-Promotion**: Authenticated User A tries to set `trustScore: 100` on `/users/A`.
2. **Identity Spoofing**: User A tries to create a request with `authorId: "B"`.
3. **Ghost Field Injection**: User A tries to add `isAdmin: true` to their profile.
4. **Denial of Wallet (String Bloating)**: User A tries to create a request with a `title` string of 500,000 characters.
5. **Request Hijacking**: User A tries to update the `description` of a request owned by User B.
6. **Timeline Tampering**: User A tries to update the `createdAt` timestamp of an existing request.
7. **Message Impersonation**: User A tries to send a message with `senderId: "B"`.
8. **Signal Snooping**: User A tries to read notifications where `userId == "B"`.
9. **Role Escalation**: User A tries to update their `role` to `Admin`.
10. **Terminal State Bypass**: User A tries to change the `status` of a 'Solved' request back to 'Open'.
11. **Path Poisoning**: User A tries to use a 1.5KB string as a `requestId` path variable.
12. **Member Deletion**: User A tries to delete User B's profile document.

## Implementation Strategy
We will use `@firebase/eslint-plugin-security-rules` to audit the rules and implement strict schema validation helpers.
