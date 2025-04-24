'use client';

import { useState } from 'react';
import { useTodo } from '@/context/TodoContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Plus } from 'lucide-react';

export default function TodoForm() {
  const [title, setTitle] = useState('');
  const { addTodo } = useTodo();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({
        title: "Boş görev eklenemez",
        description: "Lütfen bir görev açıklaması girin.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addTodo(title);
      setTitle('');
    } catch (error) {
      console.error('Görev eklenirken hata:', error);
      toast({
        title: "Görev eklenemedi",
        description: "Görev eklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Yeni görev ekle..."
          className="flex-1"
        />
        <Button type="submit" className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Ekle
        </Button>
      </div>
    </form>
  );
} 