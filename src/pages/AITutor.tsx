import { Bot } from "lucide-react";

export default function AITutor() {
  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-8">
      <h1 className="text-2xl font-black text-foreground mb-6">AI Учитель</h1>
      <div className="bg-card rounded-2xl p-8 text-center border border-border">
        <Bot className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="text-lg font-bold text-foreground mb-2">AI-учитель глаголов</h2>
        <p className="text-muted-foreground text-sm mb-4">
          Персональный учитель иврита, который объяснит беньяны, формы и даст упражнения.
        </p>
        <p className="text-xs text-muted-foreground">
          Для подключения AI-учителя потребуется настройка бэкенда.
        </p>
      </div>
    </div>
  );
}
