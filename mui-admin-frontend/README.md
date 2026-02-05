# Material UI 탭형 SPA Admin Dashboard

React + Material UI 기반의 **진짜 탭형 SPA** (Single Page Application) 관리자 시스템입니다.

## 🎯 주요 특징

### ✨ 탭 기반 인터페이스
- **브라우저 탭이 아닌** 앱 내부의 탭으로 여러 페이지 동시 작업
- 탭 추가/제거 자유롭게 가능
- 대시보드 탭은 항상 열려있음 (닫기 불가)
- 탭 간 전환 시 상태 유지

### 🔒 온프레미스 환경 최적화
- **외부 CDN 없이** 모든 리소스 로컬 번들링
- 상대 경로 API 호출 (프록시 사용)
- 네트워크 격리 환경에서도 동작
- `--host` 옵션으로 내부 네트워크 접근 가능

### 🎨 Material UI 기반
- 구글의 Material Design
- 모던하고 깔끔한 디자인
- 반응형 (모바일/태블릿/데스크톱)
- 다크모드 지원 가능

## 🚀 실행 방법

### 개발 환경

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행 (로컬)
npm run dev

# 3. 개발 서버 실행 (네트워크 접근 허용)
npm run dev
# → http://192.168.x.x:5173 으로 접속 가능
```

### 빌드 및 배포

```bash
# 1. 프로덕션 빌드
npm run build

# 2. Spring Boot로 복사
cp -r dist/* ../backend/src/main/resources/static/

# 3. Spring Boot 빌드 및 실행
cd ../backend
./mvnw package
java -jar target/*.jar
```

## 🏢 온프레미스 환경 설정

### 1. 패키지 다운로드 (인터넷 연결 PC)

```bash
# package-lock.json과 함께 압축
npm install
cd ..
zip -r mui-admin-complete.zip mui-admin-spa/
```

### 2. 오프라인 서버에 설치

```bash
# 압축 해제
unzip mui-admin-complete.zip
cd mui-admin-spa

# node_modules가 있어서 별도 설치 불필요
npm run dev
```

### 3. 내부 네트워크 접근

```bash
# 0.0.0.0으로 바인딩 (이미 설정됨)
npm run dev

# 다른 PC에서 접근
http://192.168.1.100:5173  # 서버 IP로 접속
```

## 📁 프로젝트 구조

```
src/
├── api/                    # API 호출
│   ├── request.ts         # Axios 인스턴스
│   ├── auth.ts            # 인증 API
│   └── product.ts         # 제품 API
├── contexts/              # React Context
│   ├── AuthContext.tsx    # 인증 상태 관리
│   └── TabContext.tsx     # 탭 상태 관리
├── pages/                 # 페이지 컴포넌트
│   ├── Login.tsx          # 로그인
│   ├── Dashboard.tsx      # 대시보드
│   └── ProductList.tsx    # 제품 관리
├── components/            # 공통 컴포넌트
│   └── MainLayout.tsx     # 메인 레이아웃 (탭 포함)
├── App.tsx                # 앱 루트
└── main.tsx               # 진입점
```

## 🎨 탭 시스템 작동 방식

### 탭 추가
```typescript
// 좌측 메뉴 클릭 시
addTab({
  id: 'products',
  label: '제품 관리',
  component: <ProductListPage />,
  closable: true,
});
```

### 탭 제거
```typescript
// X 버튼 클릭 시
removeTab('products');

// 자동으로 이전 탭으로 이동
```

### 탭 전환
```typescript
// 탭 클릭 시
setActiveTab('dashboard');
```

## 🔧 주요 기능

### 1. 로그인
- JWT 토큰 기반 인증
- localStorage에 토큰/사용자 정보 저장
- 자동 로그인 (토큰 있으면)

### 2. 대시보드
- 통계 카드 4개
  - 총 제품 수
  - 활성 제품
  - 총 재고
  - 재고 가치
- Material UI Card 컴포넌트 사용

### 3. 제품 관리
- **DataGrid** 사용 (Material UI X)
  - 페이지네이션
  - 정렬
  - 필터링
- CRUD 전체
  - 생성/수정: Dialog + Form
  - 삭제: 확인 다이얼로그
  - 상세보기: 읽기 전용 Dialog
- 권한 기반 UI (ADMIN만 생성/수정/삭제)

## 🎯 백엔드 연결

### API 프록시 설정

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
}
```

개발 시:
- 프론트엔드: http://localhost:5173
- API 호출: /api/products → http://localhost:8080/api/products

배포 시:
- 통합: http://localhost:8080
- API 호출: /api/products (같은 origin)

## 📊 Material UI 주요 컴포넌트

### DataGrid
```tsx
<DataGrid
  rows={products}
  columns={columns}
  pageSizeOptions={[10, 25, 50]}
  disableRowSelectionOnClick
/>
```

### Dialog (Modal)
```tsx
<Dialog open={open} onClose={handleClose}>
  <DialogTitle>제목</DialogTitle>
  <DialogContent>{/* 내용 */}</DialogContent>
  <DialogActions>{/* 버튼 */}</DialogActions>
</Dialog>
```

### Tabs
```tsx
<Tabs value={activeTab} onChange={handleChange}>
  <Tab label="탭1" value="tab1" />
  <Tab label="탭2" value="tab2" />
</Tabs>
```

## 🔐 보안

### JWT 토큰 자동 추가
```typescript
// api/request.ts
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 401 에러 시 자동 로그아웃
```typescript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);
```

## 💡 온프레미스 배포 팁

### 1. 완전 오프라인 설치

```bash
# 인터넷 연결 PC에서
npm install
tar -czf mui-admin-with-deps.tar.gz .

# 오프라인 서버에서
tar -xzf mui-admin-with-deps.tar.gz
npm run dev  # 별도 설치 없이 바로 실행
```

### 2. 내부 npm 레지스트리 사용

```bash
# .npmrc 파일 생성
registry=http://npm.company.com/
```

### 3. 방화벽 설정

```bash
# 포트 5173 개방 (개발)
# 포트 8080 개방 (운영)
```

## 🎨 커스터마이징

### 테마 변경

```typescript
// App.tsx
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },  // 파란색 → 원하는 색상
    secondary: { main: '#dc004e' },
  },
});
```

### 메뉴 추가

```typescript
// components/MainLayout.tsx
const menuItems: MenuItem[] = [
  { id: 'dashboard', label: '대시보드', icon: <Dashboard />, component: <DashboardPage /> },
  { id: 'products', label: '제품 관리', icon: <ShoppingCart />, component: <ProductListPage /> },
  // 새 메뉴 추가
  { id: 'settings', label: '설정', icon: <Settings />, component: <SettingsPage /> },
];
```

## 🐛 문제 해결

### DataGrid가 안 보임
```bash
npm install @mui/x-data-grid
```

### 네트워크에서 접근 안 됨
```bash
# vite.config.ts 확인
server: {
  host: '0.0.0.0',  // 이 설정 필요
}
```

### CORS 에러
백엔드 `CorsConfig.java`에서:
```java
config.addAllowedOrigin("http://192.168.1.100:5173");
```

## ⚡ 성능 최적화

### 빌드 최적화
```typescript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'mui': ['@mui/material', '@mui/icons-material'],
        'vendor': ['react', 'react-dom', 'axios'],
      },
    },
  },
}
```

### 코드 스플리팅
```typescript
// 페이지 lazy loading
const Dashboard = lazy(() => import('@/pages/Dashboard'));
```

## 📚 참고 문서

- [Material UI](https://mui.com/)
- [DataGrid](https://mui.com/x/react-data-grid/)
- [React Context](https://react.dev/reference/react/useContext)
- [Vite](https://vitejs.dev/)

## 🎉 특징 요약

**vs Refine/Ant Design Pro:**
- ✅ 더 가볍고 빠름
- ✅ 완전한 제어 가능
- ✅ Material Design (구글 표준)
- ✅ 탭 시스템 (진짜 SPA)
- ✅ 온프레미스 최적화
- ✅ 학습 곡선 낮음

**온프레미스 강점:**
- ✅ 외부 CDN 불필요
- ✅ 완전 로컬 번들링
- ✅ 네트워크 격리 환경 OK
- ✅ 내부망 배포 최적화

즐거운 개발 되세요! 🚀
