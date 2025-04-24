'use client';

import { useState, useRef, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ITodo } from '@/lib/models/Todo';
import { useTodo } from '@/context/TodoContext';
import { Edit2, Trash2, Save, X, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';

interface TodoProps {
  todo: ITodo;
}

export default function Todo({ todo }: TodoProps) {
  const { updateTodo, deleteTodo, todos, setTodos } = useTodo();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [isCompleted, setIsCompleted] = useState(todo.completed);
  const [isExpanded, setIsExpanded] = useState(false);
  const [confirmation, setConfirmation] = useState<null | 'delete'>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const editInputRef = useRef<HTMLTextAreaElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const { toast } = useToast();

  const isLongText = todo.title.length > 100;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(todo.title.length, todo.title.length);
    }
  }, [isEditing, todo.title.length]);

  useEffect(() => {
    if (textRef.current) {
    }
  }, [todo.title, isExpanded]);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      const length = editInputRef.current.value.length;
      editInputRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

  const handleToggleComplete = async () => {
    try {
      const updatedTodos = todos.map(t =>
        t._id === todo._id ? { ...t, completed: !t.completed } : t
      );
      setTodos(updatedTodos);
      setIsCompleted(!isCompleted);

      if (!isCompleted) {
        toast({
          title: "Görev tamamlandı! 🎉",
          description: "Harika iş! Çalışmaya devam et.",
          variant: "default",
        });
      }

      if (todo._id) {
        await updateTodo(todo._id, { completed: !todo.completed });
      }
    } catch (error) {
      console.error('Görev durumu güncellenirken hata:', error);
      setTodos(todos);

      toast({
        title: "Durum güncelleme hatası",
        description: "Görev durumu güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (confirmation !== 'delete') {
      setConfirmation('delete');

      setTimeout(() => {
        setConfirmation(null);
      }, 3000);

      return;
    }

    try {
      const updatedTodos = todos.filter(t => t._id !== todo._id);
      setTodos(updatedTodos);
      setConfirmation(null);

      if (todo._id) {
        await deleteTodo(todo._id);

        toast({
          title: "Görev silindi",
          description: "Görev listenizden kaldırıldı.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Görev silinirken hata:', error);
      setTodos(todos);

      toast({
        title: "Silme işlemi hatası",
        description: "Görev silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedTitle(todo.title);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle(todo.title);
  };

  const handleSaveEdit = async () => {
    if (editedTitle.trim() === '') {
      toast({
        title: "Görev boş olamaz",
        description: "Lütfen bir görev açıklaması girin veya iptal edin.",
        variant: "destructive",
      });
      return;
    }

    try {
      const updatedTodos = todos.map(t =>
        t._id === todo._id ? { ...t, title: editedTitle } : t
      );
      setTodos(updatedTodos);
      setIsEditing(false);

      if (todo._id) {
        await updateTodo(todo._id, { title: editedTitle });

        toast({
          title: "Görev güncellendi",
          description: "Değişiklikleriniz kaydedildi.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Görev güncellenirken hata:', error);
      setTodos(todos);
      setIsEditing(true);

      toast({
        title: "Görev güncelleme hatası",
        description: "Görev güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    }
    else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const formattedDate = todo.createdAt
    ? format(new Date(todo.createdAt), 'dd.MM.yyyy')
    : null;

  return (
    <>
      <div className={cn(
        "todo-item relative flex flex-col p-4 border-b transition-all",
        isCompleted ? "bg-muted/50 opacity-80" : "",
        "animate-fade-in hover:bg-accent/10"
      )}>
        <div className="flex items-start w-full">
          <div className="flex-shrink-0 mr-3 mt-1">
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Checkbox
                    checked={isCompleted}
                    onCheckedChange={handleToggleComplete}
                    id={`todo-${todo._id}`}
                    className={cn(
                      "h-5 w-5 rounded-full transition-all duration-300",
                      isCompleted ? "bg-green-500 text-white border-green-500 scale-110" : ""
                    )}
                    aria-label={isCompleted ? "Tamamlanmadı olarak işaretle" : "Tamamlandı olarak işaretle"}
                  />
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  align="center"
                  sideOffset={10}
                  className="z-[9999]"
                >
                  {isCompleted ? "Tamamlanmadı olarak işaretle" : "Tamamlandı olarak işaretle"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex-grow">
            {isEditing ? (
              <div className="flex flex-col">
                <Textarea
                  ref={editInputRef}
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-[100px] resize-none"
                  placeholder="Görev açıklaması..."
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="h-8"
                  >
                    <X className="h-4 w-4 mr-1" />
                    İptal
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSaveEdit}
                    className="h-8"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Kaydet
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={`todo-${todo._id}`}
                    className={cn(
                      "ml-2 text-base cursor-pointer transition-all duration-300 break-words",
                      isCompleted ? "line-through text-muted-foreground opacity-75 font-medium" : "",
                      isLongText ? "font-medium" : ""
                    )}
                  >
                    {todo.title}
                  </label>
                  {isLongText && !isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleExpand}
                      className="ml-2"
                      aria-label={isExpanded ? "Daha az göster" : "Daha fazla göster"}
                      aria-expanded={isExpanded}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
                <span className="text-xs text-muted-foreground ml-2 mt-1">
                  {formattedDate}{isLongText ? ` • ${todo.title.length} karakter` : ""}
                </span>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 ml-4">
            <div className="flex space-x-2">
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEdit}
                      className="h-8 w-8 p-0"
                      aria-label="Düzenle"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center" sideOffset={10}>
                    Düzenle
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDelete}
                      className={cn(
                        "h-8 w-8 p-0",
                        confirmation === 'delete' ? "bg-red-100 text-red-600 hover:bg-red-200" : ""
                      )}
                      aria-label={confirmation === 'delete' ? "Silme işlemini onayla" : "Sil"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center" sideOffset={10}>
                    {confirmation === 'delete' ? "Silme işlemini onayla" : "Sil"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 