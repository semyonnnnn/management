# Secret Synchronization & Snapshot Pipeline Architecture

## 1. Temporal Window & Anchor Logic

- [ ] **Anchor Identification**: Query the primary target partition for the maximum `DateStampUpd` entry to establish the synchronization baseline timestamp.
- [ ] **Rolling Boundary Computation**: Calculate the historical lower bound by subtracting precisely one calendar year from the established anchor timestamp.
- [ ] **Partition Ingestion**: Fetch records matching the evaluated rolling window parameter to construct the immutable snapshot.

## 2. Delta & Discrepancy Management (`okud` Lifecycle)

- [ ] **Path 1 (Pruning Obsolete Entities)**: Execute a diff sweep to identify and purge local snapshot identifiers that no longer exist within the active temporal window.
- [ ] **Path 2 (Seeding New Entities)**: Implement an insertion protocol for newly discovered identifiers, systematically enforcing default multipliers (`1.0`) and indicators (`1`) to preserve downstream mathematical integrity.

## 3. Modular Synchronization Architecture

- [ ] **Granular Endpoint Isolation**: Decouple synchronization routines into distinct operational modules (e.g., entity sync, state sync, distribution sync).
- [ ] **Referential Integrity Handlers**: Build validation safeguards to gracefully handle missing parent dependencies (such as unlinked departments or detached pivots) during partial sync execution.

## 4. Operational Tracking & UI/UX Controls

- [ ] **Audit Log Infrastructure**: Establish a tracking schema to record the exact execution timestamp of the most recent successful synchronization per module.
- [ ] **Contextual UI Badges**: Update button components to dynamically render the corresponding last-sync audit timestamp.
- [ ] **Global Refresh Modal**: Design an administrator-level global synchronization trigger accompanied by a confirmation modal warning of extended processing duration.
