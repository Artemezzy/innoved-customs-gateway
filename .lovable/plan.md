

## Интеграция виджета чата Bitrix24

### Анализ текущей архитектуры

Проект использует **React + Vite** (не Next.js), поэтому:
- SSR отсутствует — скрипт безопасно выполнится только в браузере
- Единый Layout компонент (`src/components/Layout.tsx`) оборачивает все страницы
- Это идеальное место для размещения виджета

### План реализации

#### 1. Создать компонент `Bitrix24Chat`

Создам новый компонент `src/components/Bitrix24Chat.tsx`, который:
- Использует `useEffect` для загрузки скрипта только на клиенте
- Проверяет, что скрипт ещё не был загружен (предотвращение дублей)
- Добавляет скрипт в конец `<body>` по рекомендации Bitrix24

```text
┌─────────────────────────────────────┐
│ src/components/Bitrix24Chat.tsx     │
├─────────────────────────────────────┤
│ • useEffect — загрузка скрипта      │
│ • Проверка на дубликаты             │
│ • Очистка при размонтировании       │
│ • Возвращает null (без UI)          │
└─────────────────────────────────────┘
```

#### 2. Подключить в Layout

Добавлю компонент `<Bitrix24Chat />` в `src/components/Layout.tsx`:

```text
┌─────────────────────────────────────┐
│            Layout.tsx               │
├─────────────────────────────────────┤
│ <Header />                          │
│ <LanguageToggle />                  │
│ <main>{children}</main>             │
│ <Footer />                          │
│ <Bitrix24Chat /> ← ДОБАВЛЯЕМ       │
└─────────────────────────────────────┘
```

### Технические детали

**Файл: `src/components/Bitrix24Chat.tsx`**

```tsx
import { useEffect } from 'react';

const BITRIX24_SCRIPT_URL = 'https://cdn-ru.bitrix24.ru/b36238818/crm/site_button/loader_1_ulqy00.js';

export function Bitrix24Chat() {
  useEffect(() => {
    // Проверяем, что скрипт ещё не добавлен
    const existingScript = document.querySelector(
      `script[src^="${BITRIX24_SCRIPT_URL}"]`
    );
    
    if (existingScript) return;
    
    // Создаём скрипт по рекомендации Bitrix24
    const script = document.createElement('script');
    script.async = true;
    script.src = `${BITRIX24_SCRIPT_URL}?${(Date.now() / 60000) | 0}`;
    
    // Вставляем в конец body
    document.body.appendChild(script);
    
    // Очистка при размонтировании (опционально)
    return () => {
      // Bitrix24 виджет сам управляет своим жизненным циклом
    };
  }, []);

  return null; // Компонент не рендерит UI
}
```

**Изменения в `src/components/Layout.tsx`**

```tsx
import { Bitrix24Chat } from './Bitrix24Chat';

export function Layout({ children }: LayoutProps) {
  // ... существующий код ...
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* ... Header, LanguageToggle, main, Footer ... */}
      <Bitrix24Chat />
    </div>
  );
}
```

### Почему этот подход правильный

| Требование | Решение |
|------------|---------|
| Один раз для всего сайта | Layout оборачивает ВСЕ страницы |
| Без дублей | Проверка `existingScript` |
| Client-side only | `useEffect` выполняется только в браузере |
| В конце body | `document.body.appendChild()` |
| Легко заменить URL | Константа `BITRIX24_SCRIPT_URL` в одном месте |

### Где менять URL виджета в будущем

Если нужно заменить виджет на другой Bitrix24, измените одну строку в файле:

**`src/components/Bitrix24Chat.tsx`, строка 3:**
```tsx
const BITRIX24_SCRIPT_URL = 'https://cdn-ru.bitrix24.ru/НОВЫЙ_URL.js';
```

### После деплоя

Виджет Bitrix24:
- Появится в правом нижнем углу (или где настроено в Bitrix24)
- Внешний вид полностью управляется из Bitrix24
- Обращения будут создаваться в вашей CRM автоматически

