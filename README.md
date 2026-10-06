# React Todo App — 학습 기록

React + Supabase 기반 할 일 관리 서비스입니다. 

- **배포 주소**: https://b1-2-ruddy.vercel.app
- **기술 스택**: React 19, React Router 7, Supabase, Vercel

---

## 실행 방법

```bash
npm install
```

프로젝트 루트에 `.env` 파일 생성 후:

```
VITE_SUPABASE_URL=발급받은_프로젝트_URL_개인정보삭제
VITE_SUPABASE_ANON_KEY=발급받은_Publishable_key_개인정보삭제
```

```bash
npm run dev
```

---

## 프로젝트 구조

```
src/
├── components/      재사용 UI 컴포넌트 (8개 이상)
│   ├── Header.jsx / Footer.jsx / Layout.jsx   #공통 레이아웃
│   ├── Button.jsx / Input.jsx / Card.jsx       #기본 UI
│   ├── Loading.jsx / ErrorState.jsx / EmptyState.jsx   #데이터 상태 3종
│   └── TodoList.jsx / TodoForm.jsx             #Todo 도메인 조합 컴포넌트
│
├── hooks/
│   └── useTodos.js  #Supabase CRUD 로직을 담은 커스텀 훅
│
├── lib/
│   └── supabaseClient.js   #Supabase 클라이언트 초기화 (한 곳에서만 생성)
│
├── pages/           #라우트 단위 화면
│   └──  HomePage / TodoListPage / TodoDetailPage / TodoNewPage / NotFoundPage
│
├── App.jsx          #라우터 설정 (중첩 라우트, Layout)
├── main.jsx         #진입점, BrowserRouter + StrictMode
└── index.css        #전역 스타일, CSS 변수 기반 디자인 시스템
```

**설계 원칙**: `pages`는 조립만 담당하고, `components`는 재사용 가능한 조각을 담당한다. <br>
`hooks`는 "데이터를 어떻게 다루는지"를, 컴포넌트는 "무엇을 어떻게 보여줄지"를 책임지게 역할을 분리했다.

---

## 0단계 — React 핵심 개념 (컴포넌트 / props / state)

### 컴포넌트 = 함수

React 컴포넌트는 **JSX(화면 모양)를 반환하는 자바스크립트 함수**다.

```jsx
function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <p>현재 값: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  )
}
```

### props vs state

- **props**: 부모가 넘겨주는 읽기 전용 입력값. 컴포넌트 내부에서 직접 수정하지 않는다.
- **state**: 컴포넌트가 스스로 소유하고, `set` 함수를 통해서만 변경하는 값.
- props 이름은 "태그에 적은 이름 = 자식이 받는 이름"만 맞으면 되고, 부모가 어떤 변수명으로 값을 담아뒀는지는 자식과 무관하다.

### 실험 1 — 왜 `count = count + 1`은 화면을 못 바꾸는가

| 방식 | 결과 |
|---|---|
| `const count`에 재할당 | `TypeError: Assignment to constant variable.` |
| `let count`에 재할당 | 에러는 없지만 **화면은 그대로** |
| `setCount(count + 1)` 호출 | 화면이 정상 업데이트됨 |

**핵심 결론**: React는 변수를 감시하지 않는다. **`set` 함수를 호출해야만** "다시 그려야 한다"는 신호가 전달되고 리렌더링된다. 값이 실제로 바뀌었는지는 상관없다.

- `const`/`let`/`var`는 변수 선언 키워드
- **재할당**(기존 변수에 새 값 대입)과 **재선언**(같은 이름으로 다시 선언)은 다른 개념 — `const`는 둘 다 불가, `let`은 재할당만 가능

### 실험 2 — 콘솔 로그가 두 번씩 찍히는 이유 (StrictMode)

개발 모드(`npm run dev`)에서 컴포넌트 함수 안의 `console.log`가 마운트 시 2번, 클릭마다 2번씩 찍힌다.

**원인**: `main.jsx`의 `<StrictMode>`가 개발 모드에서 컴포넌트 함수를 의도적으로 두 번 호출해, 렌더링 중 부작용(side effect) 실수를 조기에 발견하게 돕는다.

**검증**: `npm run build && npm run preview`(production 빌드)에서는 이중 호출이 사라지고 정확히 한 번씩만 찍힌다.

> 브라우저 콘솔은 동일 메시지가 연속 반복되면 숫자 배지(`n번 반복됨`)로 묶어 보여준다. 이는 콘솔 자체의 UI 기능이며 React 동작과 무관하다.

### 핵심 요약

state가 바뀐다 = `set` 함수가 호출된다 = 리렌더링된다 — 이 세 가지는 항상 같이 움직인다.

---

## 1단계 — 라우팅 (React Router)

### 핵심 개념

SPA는 페이지 새로고침 없이 URL만 바뀌는 구조다. `<Routes>`는 현재 URL에 맞는 컴포넌트 하나를 고르는 스위치다.

```jsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/todos" element={<TodoListPage />} />
  <Route path="/todos/:id" element={<TodoDetailPage />} />
  <Route path="/todos/new" element={<TodoNewPage />} />
  <Route path="*" element={<NotFoundPage />} />
</Routes>
```

- `:id` 처럼 콜론이 붙으면 **아무 값이나 받는 자리**. `useParams()`로 꺼내 쓴다.
- `*`는 위 어디에도 안 맞는 나머지 전부 → 404 처리.
- `<Link to="...">`는 클릭 시 페이지 이동, `useNavigate()`는 **코드로** 이동시킬 때 사용 (폼 제출 성공 후 자동 이동 등).

### 배운 것: React Router v6+는 순서가 아니라 구체성으로 매칭

`/todos/:id`를 `/todos/new`보다 위에 적어도, `/todos/new`로 접속하면 **더 구체적으로 맞는 고정 문자열 경로가 우선** 선택된다 (v5 이전처럼 선언 순서대로 매칭되지 않음).

### 중첩 라우트 — 공통 레이아웃(Header/Footer)

```jsx
<Route path="/" element={<Layout />}>
  <Route index element={<HomePage />} />
  <Route path="todos" element={<TodoListPage />} />
  ...
</Route>
```

`Layout` 안의 `<Outlet />`이 "현재 URL에 맞는 자식 페이지가 들어갈 자리"다. 자식 라우트의 `path`는 부모 기준 상대경로이며, `index`는 부모 경로(`/`)에 정확히 일치할 때의 기본 페이지를 뜻한다.

---

## 2단계 — 컴포넌트 설계 & 폴더 구조

### 왜 나누는가

`pages/`는 라우트 하나에 대응하는 화면, `components/`는 여러 곳에서 재사용되는 조각. 재사용 안 되는 요소까지 쪼개는 게 아니라, **반복되는 UI를 한 곳에서 관리**하기 위해 나눈다.

### 만든 컴포넌트 8종과 설계 패턴

- **Button, Input, Card**: 범용 UI. `children`으로 내용을 받고, 동작(`onClick`, `onChange`)은 부모가 결정 — 컴포넌트 자신은 "모양"만 책임진다.
- **Loading, ErrorState, EmptyState**: 데이터를 다루는 화면이 항상 거쳐야 하는 3가지 상태를 전담하는 컴포넌트.
- **TodoList, TodoForm**: 위 컴포넌트들을 조립한 도메인 전용 컴포넌트.

```jsx
function Button({ children, onClick, type = 'button', disabled = false }) {
  return <button type={type} onClick={onClick} disabled={disabled}>{children}</button>
}
```

- `children`: React가 제공하는 특수 prop. 태그 사이의 내용이 자동으로 들어온다.
- `type = 'button'` 같은 기본값: 부모가 안 넘기면 이 값 사용. `<form>` 안 버튼의 의도치 않은 제출을 막기 위한 설계.

---

## 3단계 — 상태관리 & 커스텀 훅

### 커스텀 훅이란

`use`로 시작하는, 안에서 다른 훅을 쓸 수 있는 평범한 자바스크립트 함수. "데이터를 다루는 로직"을 컴포넌트에서 분리해 재사용 가능하게 만든다.

```jsx
function useTodos() {
  const [todos, setTodos] = useState([...])
  function addTodo(title) { ... }
  return { todos, addTodo }
}
```

### 중요한 한계 — 커스텀 훅도 호출할 때마다 독립된 state를 가진다

`TodoListPage`와 `TodoDetailPage`가 각각 `useTodos()`를 호출하면, **서로 다른 저장 공간**이 만들어진다. 한쪽에서 추가한 할 일이 다른 쪽에는 보이지 않는다 — 이게 바로 4단계(서버 연동)가 필요한 이유였다.

### 비동기 데이터의 3단계 상태 패턴

```
로딩 중 (loading) → 성공 (data) / 실패 (error)
```

여기에 "성공했는데 데이터가 0개"(Empty)를 추가로 구분해, 실질적으로는 로딩/에러/빈 상태/정상 4가지 화면 분기가 생긴다.

---

## 4단계 — CRUD & Supabase 연동

### 흐름

`useTodos` 훅의 **바깥 모양은 그대로 두고, 안에서 데이터를 어디서 가져오는지만 교체**했다. `TodoListPage`, `TodoDetailPage` 코드는 거의 건드릴 필요가 없었다 — 미리 훅으로 분리해둔 덕분.

```jsx
async function fetchTodos() {
  setLoading(true)
  const { data, error } = await supabase
    .from('todos').select('*').order('created_at', { ascending: true })
  if (error) setError(error.message)
  else setTodos(data)
  setLoading(false)
}
```

### 핵심 개념

- **async/await**: 네트워크 요청처럼 시간이 걸리는 작업을 "끝날 때까지 기다렸다 다음 줄 실행"하게 만드는 문법.
- **`{ data, error }` 동시 반환**: Supabase는 실패해도 JS 예외가 아니라 `error` 객체로 알려준다. 매번 `if (error)`로 직접 확인해야 한다.
- **배열 불변성 원칙**: `todos.push(x)`처럼 원본을 직접 바꾸면 안 되고, `[...todos, x]`(추가), `todos.filter(...)`(삭제), `todos.map(...)`(수정)처럼 **항상 새 배열을 만들어 `setTodos`에 넘긴다.** React가 변화를 감지하려면 이전과 다른 참조값이 필요하기 때문.
- **객체 불변성**: `{ ...todo, is_done: !isDone }` — 스프레드로 기존 속성을 복사하고 바꿀 속성만 덮어쓴다.
- **`.eq('id', id)`**: 삭제/수정 시 대상 행을 정확히 지정. 빠뜨리면 테이블 전체에 영향을 줄 수 있는 위험한 요청이 된다.

### 환경변수 (.env)

- Vite 환경변수는 반드시 `VITE_` 접두사가 있어야 `import.meta.env.VITE_...`로 읽힌다.
- `.env`는 `.gitignore`에 반드시 포함 — API 키가 GitHub에 올라가면 안 됨.
- `anon/publishable key`는 브라우저에 노출돼도 되도록 설계된 공개 키다. `secret key`는 절대 클라이언트 코드에 넣지 않는다.
- Supabase 테이블 생성 시 RLS(Row Level Security)를 켜면 정책(policy)을 작성하지 않는 한 쿼리 결과가 항상 빈 배열이 된다. 로그인 기능이 없는 학습 단계에서는 RLS를 꺼둔 상태로 진행.

---

## 5단계 — 폼 UX

### 패턴: try / catch / finally + throw

```jsx
async function addTodo(title) {
  const { error } = await supabase.from('todos').insert([{ title }])
  if (error) {
    setError(error.message)
    throw new Error(error.message)   // 호출한 쪽에 실패를 알림
  }
}
```

```jsx
try {
  await onSubmit(title)
  setTitle('')
} catch {
  setError('추가에 실패했습니다.')
} finally {
  setSubmitting(false)
}
```

- `setError`는 **훅 자신의 상태**를 바꾸는 것, `throw`는 **호출자에게 실패를 알리는 신호**. 역할이 다르므로 폼이 올바르게 반응하려면(입력값 유지, 버튼 복구) 반드시 `throw`가 필요하다.
- `submitting` state로 버튼을 `disabled` 처리 → 중복 제출 방지.
- 입력창의 `value`/`onChange` 세트(Controlled Input)가 빠지면, state가 입력을 강제로 되돌려 타이핑이 안 되는 것처럼 보인다.

---

## 6단계 — 배포 & 마무리

### 배포 절차 (Vercel)

1. GitHub 레포 push (`.env`는 반드시 제외)
2. Vercel에서 레포 Import
3. **Environment Variables**에 `.env`와 동일한 키/값 입력 — 이 단계를 빠뜨리면 빌드는 되지만 데이터가 전혀 안 뜬다.
4. Deploy

### 겪은 트러블슈팅 — 콜론 하나, 글자 하나가 전체를 막는 경험들

| 증상 | 원인 | 교훈 |
|---|---|---|
| `Failed to resolve import ".../HomePage"` | import 경로와 실제 파일 위치/이름 불일치 | `Does the file exist?`가 핵심 힌트. 경로 → 파일 위치 → 대소문자 순으로 확인 |
| `does not provide an export named 'default'` | `export default` 줄이 함수 바깥 중괄호 짝이 안 맞아 누락된 것처럼 처리됨 | 괄호 개수와 들여쓰기로 구조를 눈으로 확인하는 습관 |
| CSS가 전혀 안 먹음 | 스타일을 `App.css`에 작성했는데 `App.jsx`가 그 파일을 import하지 않음 (혹은 반대로 두 CSS 파일이 충돌) | CSS도 JS처럼 **import해야 적용된다.** 스타일 파일은 하나로 통일 관리 |
| 배포 후 `TypeError: Failed to execute 'set' on 'Headers'` | Vercel 환경변수 값에 복사 과정에서 섞인 비표준 문자 | 환경변수는 복사 아이콘으로 정확히 복사, 의심되면 지우고 재입력 |
| 배포 후 `/todos/3` 새로고침 시 404 | 정적 호스팅이 가짜 경로(React Router가 처리하는 경로)의 실제 파일을 찾으려 함 | `vercel.json`의 `rewrites`로 모든 경로를 `index.html`로 보내 React Router가 처리하게 함 |

```json
// vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### 환경변수 수정 후 반드시 재배포해야 함

Vercel 환경변수는 **저장만으로는 기존 배포에 반영되지 않는다.** 코드 변경이 없어도 아래처럼 빈 커밋으로 재배포를 트리거할 수 있다.

```bash
git commit --allow-empty -m "chore: trigger redeploy"
git push
```

---

## 전체를 관통하는 핵심 원칙 3가지

1. **state가 바뀐다 = 리렌더링된다** — 이 연결고리 하나가 React의 거의 모든 동작을 설명한다.
2. **데이터는 항상 불변하게 다룬다** — 배열/객체를 직접 수정하지 않고 항상 새로 만들어 교체한다.
3. **책임을 분리한다** — pages는 조립만, components는 UI만, hooks는 데이터 로직만. 하나가 여러 일을 떠안지 않게 하면 코드가 커져도 각 부분을 따로 이해할 수 있다.

## 다음에 도전해볼 만한 것

- 할 일 **수정(제목 변경)** 기능 — CRUD의 Update를 한 번 더 깊이 연습
- **로그인 + RLS** — Supabase Auth로 사용자별 데이터 분리, Row Level Security 정책 작성
- 컴포넌트 CSS 분리 (`Button.module.css` 등) — 프로젝트가 커질 때의 스타일 관리 전략
