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
  }, []);

  return null; // Компонент не рендерит UI
}
