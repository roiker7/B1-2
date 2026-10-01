# Todo App

React + Supabase로 만든 할 일 관리 서비스

## 기술 스택
- React 19
- React Router 7
- Supabase

## 실행 방법

```
npm install
```

.env 파일 생성 후 아래 값 입력

```
VITE_SUPABASE_URL=your_project_url = <개인정보 삭제>
VITE_SUPABASE_ANON_KEY=your_publishable_key = <개인정보 삭제>
```

```
npm run dev
```

-----------

# 0단계: React 핵심 개념 (컴포넌트 / props / state)

React Todo 프로젝트를 시작하기 전, 가장 기본이 되는 세 가지 개념을 직접 실험하며 정리했습니다.

## 1. 컴포넌트 = 함수

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

## 2. props vs state

- **props**: 부모가 넘겨주는 읽기 전용 입력값. 컴포넌트 내부에서 직접 수정하지 않는다.
- **state**: 컴포넌트가 스스로 소유하고, `set` 함수를 통해서만 변경하는 값.

## 3. 실험 1 — 왜 `count = count + 1`은 화면을 못 바꾸는가

| 방식 | 결과 |
|---|---|
| `const count`에 재할당 (`count = count + 1`) | `TypeError: Assignment to constant variable.` 에러 발생 |
| `let count`에 재할당 | 에러는 없지만 **화면은 그대로** |
| `setCount(count + 1)` 호출 | 화면이 정상적으로 업데이트됨 |

**핵심 결론**: React는 변수를 감시하고 있지 않는다. 값이 실제로 바뀌었는지 여부와 상관없이, **`setCount` 같은 state 업데이트 함수를 호출해야만** React가 "다시 그려야 한다"는 신호를 받고 리렌더링한다.

부가적으로 확인한 자바스크립트 개념:
- `const` / `let` / `var`는 모두 **변수 선언 키워드**
- **재할당**(이미 선언된 변수에 새 값 대입)과 **재선언**(같은 이름으로 다시 `let`/`const` 사용)은 다른 개념
  - `const`: 재할당 불가, 재선언 불가
  - `let`: 재할당 가능, 재선언 불가

## 4. 실험 2 — 콘솔 로그가 두 번씩 찍히는 이유 (StrictMode)

`npm run dev`로 실행한 개발 모드에서 컴포넌트 함수 맨 위에 `console.log`를 찍으면, 마운트 시 2번 / 클릭마다 2번씩 로그가 찍혔다.

**원인**: `main.jsx`의 `<StrictMode>`가 개발 모드에서 컴포넌트 함수를 의도적으로 두 번씩 호출한다. 컴포넌트가 렌더링 중에 부작용(side effect)을 일으키는 실수를 조기에 발견하도록 돕기 위한 React의 디버깅 기능이다.

**검증**: `npm run build && npm run preview`로 production 빌드를 실행하면 StrictMode의 이중 호출이 사라지고, 로그가 정확히 한 번씩만 찍힌다.

> 참고: 브라우저 콘솔은 동일한 메시지가 연속으로 반복되면 줄마다 나열하지 않고 `n번 반복됨`이라는 숫자 배지로 묶어서 보여준다. 이는 React의 동작과 무관한 콘솔 자체의 UI 기능이다.

## 정리

- 컴포넌트 = 함수, props = 읽기 전용 입력, state = `set` 함수로만 바뀌는 값
- **state가 바뀐다 = `set` 함수가 호출된다 = 리렌더링된다**, 이 세 가지는 항상 같이 움직인다
- 개발 모드의 이중 렌더링은 버그가 아니라 StrictMode의 의도된 동작이며, production에서는 나타나지 않는다

