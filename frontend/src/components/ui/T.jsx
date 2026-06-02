import React, { useState, useEffect } from 'react';
import { translateTextApi } from '../../services/api';

// Cache to prevent repeated translation API calls for the same text
const translationCache = {};

export default function T({ children }) {
  const [translated, setTranslated] = useState(children);
  const [loading, setLoading] = useState(false);
  const activeLang = localStorage.getItem('cma_lang') || 'en';

  useEffect(() => {
    if (activeLang === 'en' || !children || typeof children !== 'string') {
      setTranslated(children);
      return;
    }

    const textToTranslate = children.trim();
    if (!textToTranslate) {
      setTranslated(children);
      return;
    }

    // Check cache
    const cacheKey = `${textToTranslate}_${activeLang}`;
    if (translationCache[cacheKey]) {
      setTranslated(translationCache[cacheKey]);
      return;
    }

    setLoading(true);
    translateTextApi(textToTranslate, activeLang)
      .then((res) => {
        const trans = res.data?.translated || textToTranslate;
        translationCache[cacheKey] = trans;
        setTranslated(trans);
      })
      .catch(() => {
        // fallback to original children on error
        setTranslated(children);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [children, activeLang]);

  return <>{translated}</>;
}
