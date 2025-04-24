'use client';

import { useTodo } from '@/context/TodoContext';
import Todo from '@/components/Todo';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { CheckCircle, ClipboardList, AlertCircle, AlignCenter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useMemo } from 'react';

export default function TodoList() {
  const { todos, loading, error } = useTodo();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredTodos = useMemo(() => {
    if (filter === 'all') return todos;
    if (filter === 'active') return todos.filter(todo => !todo.completed);
    if (filter === 'completed') return todos.filter(todo => todo.completed);
    return todos;
  }, [todos, filter]);

  // Stats
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;
    const percentComplete = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, active, percentComplete };
  }, [todos]);

  if (!mounted) {
    return null;
  }

  if (loading && todos.length === 0) {
    return (
      <Card className="animate-pulse overflow-hidden">
        <CardHeader>
          <div className="h-6 w-32 bg-muted rounded-md loading-shimmer"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center h-12 bg-muted rounded-md loading-shimmer"></div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 animate-fade-in">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Hata
          </CardTitle>
          <CardDescription className="text-red-500">
            Görevler yüklenirken bir hata oluştu. Lütfen MongoDB bağlantınızı kontrol edin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (todos.length === 0) {
    return (
      <Card className="border-dashed animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center">
            <ClipboardList className="h-8 w-8 mr-2 text-muted-foreground" />
            Henüz görev yok
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-muted-foreground mb-4">Görev listeniz boş. İlk görevinizi ekleyin!</p>
            <div className="border-2 border-dashed border-muted rounded-lg p-6 w-full max-w-xs animate-pulse">
              <p className="text-muted-foreground">Görevleriniz burada görünecek</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <ClipboardList className="h-5 w-5 mr-2" />
            Görevleriniz
          </CardTitle>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className="rounded-full text-xs"
          >
            <AlignCenter className="h-4 w-4 mr-1" />
            Tümü ({stats.total})
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('active')}
            className="rounded-full text-xs"
          >
            Aktif ({stats.active})
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('completed')}
            className="rounded-full text-xs"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Tamamlanan ({stats.completed})
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y">
          {filteredTodos.map((todo) => (
            <Todo key={todo._id} todo={todo} />
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between p-4 border-t">
        <p className="text-sm text-muted-foreground">
          {stats.active} görev kaldı
        </p>
        <div className="w-full max-w-[120px] bg-muted h-2 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-500 ease-out"
            style={{ width: `${stats.percentComplete}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          %{stats.percentComplete} tamamlandı
        </p>
      </CardFooter>
    </Card>
  );
} 