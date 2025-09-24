import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Trash2, Edit3, Calendar, CheckCircle2 } from "lucide-react";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export default function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  // Load todos from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTodos(parsed.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt)
        })));
      } catch (error) {
        console.error("Failed to load todos:", error);
      }
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!newTodo.trim()) {
      toast({
        title: "Error",
        description: "Please enter a todo item",
        variant: "destructive",
      });
      return;
    }

    if (newTodo.trim().length < 3) {
      toast({
        title: "Error",
        description: "Todo must be at least 3 characters long",
        variant: "destructive",
      });
      return;
    }

    const todo: Todo = {
      id: Date.now().toString(),
      title: newTodo.trim(),
      completed: false,
      createdAt: new Date(),
    };

    setTodos(prev => [todo, ...prev]);
    setNewTodo("");
    
    toast({
      title: "Success",
      description: "Todo added successfully",
    });
  };

  const toggleComplete = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingText(todo.title);
  };

  const saveEdit = () => {
    if (!editingText.trim()) {
      toast({
        title: "Error",
        description: "Todo cannot be empty",
        variant: "destructive",
      });
      return;
    }

    if (editingText.trim().length < 3) {
      toast({
        title: "Error",
        description: "Todo must be at least 3 characters long",
        variant: "destructive",
      });
      return;
    }

    setTodos(prev => prev.map(todo =>
      todo.id === editingId ? { ...todo, title: editingText.trim() } : todo
    ));
    
    setEditingId(null);
    setEditingText("");
    
    toast({
      title: "Success",
      description: "Todo updated successfully",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const deleteTodo = () => {
    if (!deleteId) return;
    
    setTodos(prev => prev.filter(todo => todo.id !== deleteId));
    setDeleteId(null);
    
    toast({
      title: "Success",
      description: "Todo deleted successfully",
    });
  };

  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{completedCount}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{totalCount - completedCount}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary font-bold">{totalCount}</span>
            </div>
            <p className="text-2xl font-bold">{totalCount}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
      </div>

      {/* Add New Todo */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Todo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="What needs to be done?"
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              data-testid="input-new-todo"
            />
            <Button onClick={addTodo} data-testid="button-add-todo">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search todos..."
              className="pl-10"
              data-testid="input-search-todos"
            />
          </div>
        </CardContent>
      </Card>

      {/* Todos List */}
      <Card>
        <CardHeader>
          <CardTitle>Todo List</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTodos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {todos.length === 0 ? (
                <p>No todos yet. Add your first todo above!</p>
              ) : (
                <p>No todos match your search.</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                    todo.completed 
                      ? 'bg-muted/50 border-muted' 
                      : 'bg-card border-border hover:bg-accent/50'
                  }`}
                >
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleComplete(todo.id)}
                    data-testid={`checkbox-todo-${todo.id}`}
                  />
                  
                  <div className="flex-1 min-w-0">
                    {editingId === todo.id ? (
                      <div className="flex gap-2">
                        <Input
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit();
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          className="flex-1"
                          autoFocus
                          data-testid={`input-edit-todo-${todo.id}`}
                        />
                        <Button size="sm" onClick={saveEdit} data-testid={`button-save-${todo.id}`}>
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit} data-testid={`button-cancel-${todo.id}`}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <p className={`${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {todo.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {todo.createdAt.toLocaleDateString()}
                          </Badge>
                          {todo.completed && (
                            <Badge className="text-xs bg-green-500">
                              Completed
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {editingId !== todo.id && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditing(todo)}
                        data-testid={`button-edit-${todo.id}`}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(todo.id)}
                        data-testid={`button-delete-${todo.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Todo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this todo? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteTodo} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
