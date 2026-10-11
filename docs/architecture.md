# Architecture: geofroes-niver

Status: initial documentation scaffold, not a prescribed architecture.

## Context
Purpose: A definir a partir do briefing e do código existente.
Observed stack: Ainda não identificado; verificar a implementação.
Identify current entrypoints, business capabilities, runtime and deployment constraints from the codebase.

## Boundaries and ownership
Document actual modules/services, dependencies, public contracts and data ownership. Start with the simplest structure appropriate to this project; no service split, DDD, CQRS or framework is implied by this file.

## Data and failure behavior
Record storage choices, invariants, schema evolution, authorization boundaries and relevant idempotency/retry/transaction rules. Add only concerns the system actually has.

## Operation and verification
Record validated setup/test/build commands, observability, deployment and rollback procedures. Separate current behavior from proposals.

## Decisions and tradeoffs
For consequential choices record context, selected option, alternatives, consequences and reversal cost. Use the repository's ADR convention if one exists.
