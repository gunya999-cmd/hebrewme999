#!/bin/bash
# Скрипт для загрузки изменений на GitHub
# Запусти в папке проекта: bash push_to_github.sh

echo "🚀 Загружаем изменения на GitHub..."

# Убедимся что .env не попадёт в git
if git ls-files --cached .env | grep -q ".env"; then
  echo "⚠️  Удаляем .env из отслеживания git..."
  git rm --cached .env
fi

git add -A
git status
echo ""
echo "📝 Введи описание изменений (или нажми Enter для стандартного):"
read commit_msg
if [ -z "$commit_msg" ]; then
  commit_msg="fix: исправления ошибок и улучшения интерфейса"
fi

git commit -m "$commit_msg"
git push origin main

echo ""
echo "✅ Готово! Изменения загружены на GitHub."
