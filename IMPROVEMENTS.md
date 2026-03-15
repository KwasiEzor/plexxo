# Plexxo Improvement Plan: Collaboration, Admin & Role-Based Actions

This document outlines the strategic roadmap for enhancing the collaboration and administrative capabilities of Plexxo, ordered by implementation priority.

---

## Phase 1: Robust Collaboration (High Priority)
*Goal: Enable seamless team building and real-time interaction.*

1.  **Universal Invitation System:** 
    *   Allow inviting users by email even if they don't have a Plexxo account yet.
    *   Generate secure, signed invitation links sent via email.
    *   Automatic project joining upon registration.
2.  **Real-Time Presence (WebSockets):**
    *   Integrate Laravel Reverb to show "Who's Online" in a project.
    *   Display active collaborator avatars on specific chapters to prevent edit collisions.
3.  **Collaborative Activity Feed:**
    *   A "Project Pulse" sidebar showing a chronological log of actions (e.g., "Jean added a source," "Marie generated a cover").
    *   Leverage existing `Spatie Activitylog` data for the UI.

## Phase 2: Granular Access Control (Medium Priority)
*Goal: Define clear boundaries and protect project integrity.*

1.  **Role Expansion:**
    *   **Reviewer Role:** Can read and add comments/annotations but cannot edit content or use AI tokens.
    *   **Project Admin:** Can manage collaborators and billing without being the primary owner.
2.  **AI Token Quotas:**
    *   Allow Project Owners to set per-user token limits to manage costs and prevent abuse by guests.
3.  **Advanced Policies:**
    *   Restrict "Export" and "Publish" actions to Owners and Admins only.

## Phase 3: Administrative Control Tower (Medium Priority)
*Goal: Provide a high-level view of the platform and project health.*

1.  **Platform Admin Dashboard:**
    *   Global stats: Total users, active subscriptions (Stripe), total AI tokens used across the system.
    *   User management: Ability to impersonate users for support or manage bans.
2.  **Project Snapshot & Rollback:**
    *   Allow admins to view "Chapter History" and restore previous versions if a collaborator makes an error.
3.  **Official Template Manager:**
    *   Interface for admins to create and curate the "Official" templates library.

## Phase 4: Shared Creative Assets (Low Priority)
*Goal: Ensure consistency across the entire team.*

1.  **Shared Style Guide & Glossary:**
    *   A centralized repository of character names, lore, and writing rules that the AI automatically injects into every prompt.
2.  **Internal Marketplace:**
    *   Allow users to "clone" or "share" their successful project structures with team members or the wider community.

---

**Current Status:** Implementation starting with **Phase 1: Universal Invitation System**.
