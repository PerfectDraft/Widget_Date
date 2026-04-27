# Skill: Stitch-to-Logic Bridge

**Version:** 1.0
**Scope:** Any task involving a Stitch MCP UI import that needs real application logic wired to it.
**Trigger:** Load this skill when the user says "keo tu Stitch", "import from Stitch", or when working with a freshly imported Stitch component.

---

## Core Philosophy

Stitch exports UI structure. Your job is to add logic around the component, never inside it.

- Stitch component = the shell (className, layout, visual states)
- Your job = the brain (data, handlers, side effects, types)

The component is the contract. Adapt logic to fit the UI.
Never adapt the UI to fit your logic assumptions.

---

## Pre-flight: Before Touching Any File

### Check 1 - Read component-contract.md
Read: .agent/rules/component-contract.md
Confirm what you can and cannot modify before proceeding.

### Check 2 - Inventory the imported component
Open the Stitch-imported file and fill this table completely:

| Question | Answer |
|---|---|
| Component name? | |
| Props it accepts? | |
| Props with no real value yet? | |
| Interactive elements? (buttons, inputs, forms) | |
| Visual states? (loading, empty, error, success) | |
| Data shapes implied by the UI? | |

Do NOT proceed until every row is filled.

### Check 3 - Map props to data sources

| Prop name | Data source | Type | Already exists? |
|---|---|---|---|
| items | GET /api/locations | LocationItem[] | Yes - types/index.ts |
| onSelect | local state setter | (id: string) => void | No - must create |
| isLoading | fetch hook state | boolean | Yes - useLocations.ts |

If a data source does not exist: create it BEFORE wiring the component.

### Check 4 - Identify side effects

| User action | Side effect | Async? | Error state needed? |
|---|---|---|---|
| Click button | push to state | No | No |
| Submit form | call API | Yes | Yes |
| Login | trigger OAuth | Yes | Yes |

---

## Execution Protocol (strict order — do not skip steps)

### Step 1 - Generate TypeScript types first

```typescript
export interface [ComponentName]Props {
  items: [Type][];
  isLoading: boolean;
  onSelect: (id: string) => void;
  emptyMessage?: string;
}
```

Run: npx tsc --noEmit
Fix all errors before continuing to Step 2.

### Step 2 - Create the data hook (if needed)

```typescript
// client/src/hooks/use[Feature].ts
export function use[Feature]() {
  const [data, setData] = useState<[Type][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.[method]();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  return { data, isLoading, error, refetch: fetchData };
}
```

Hook rules:
- Always expose isLoading and error, never hide async state
- Always use useCallback for dependency array functions
- Always clean up subscriptions in useEffect return
- Never put business logic directly in the component

### Step 3 - Create handlers for every interactive element

```typescript
const handle[Action] = useCallback(async ([params]) => {
  // 1. optimistic update if applicable
  // 2. call API or update state
  // 3. catch and handle error
  // 4. update UI on success
}, [dependencies]);
```

Handler rules:
- Every async handler must have try/catch, never throw silently
- Every state-mutating handler must show user feedback (toast, loading, error)
- Never write async logic inline in JSX onClick, always extract to named handler

### Step 4 - Wire props to the component

```typescript
<[StitchComponent]
  items={data}
  isLoading={isLoading}
  onSelect={handleSelect}
  emptyMessage="No items found"
/>
```

Wiring rules:
- Pass ONLY props the component declares
- If extra behavior needed: use a wrapper, not internal edits
- Change className only for layout context, never component-internal classNames

### Step 5 - Implement all four visual states

| State | Required | What to provide |
|---|---|---|
| Loading | Always | spinner or skeleton |
| Empty | Always | message, not blank screen |
| Error | Always | readable message, not just console.error |
| Success | Always | happy path with real data |

If Stitch component lacks built-in states:

```typescript
function [ComponentName]WithStates() {
  const { data, isLoading, error } = use[Feature]();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (data.length === 0) return <EmptyState message="Nothing here yet" />;
  return <[StitchComponent] items={data} />;
}
```

### Step 6 - Verification gate
1. npx tsc --noEmit → zero errors required

2. npx eslint client/src/[path] → zero errors required

3. Visual check:
[] Loading state renders correctly
[] Empty state renders correctly
[] Error state renders correctly
[] Happy path shows real data
[] All buttons/inputs respond correctly
[] No console errors in browser