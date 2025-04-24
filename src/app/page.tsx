'use client';

import TodoList from '@/components/TodoList';
import TodoForm from '@/components/TodoForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto py-8 px-4 max-w-3xl">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Yapılacaklar Uygulaması
            </h1>
            <p className="text-muted-foreground">Görevlerinizi verimli bir şekilde yönetin</p>
          </div>
        </header>

        <TodoForm />
        <TodoList />

      
      </div>
    </main>
  );
}
