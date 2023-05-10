import React, { useState } from 'react';

function MainPage() {
    const [todoList, setTodoList] = useState({
        todo: [
            { done: true, text: 'Yemek Yap' },
            { done: true, text: 'Spor Yap' },
            { done: false, text: 'Ders Çalış' },
            { done: false, text: 'Gitar Çal' },
            { done: true, text: 'Kitap Oku' },
            { done: false, text: 'Sağlıklı Beslen' },
        ],
    });
    const [newTodo, setNewTodo] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingText, setEditingText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newTodo.trim()) return;
        const newTodoObj = { done: false, text: newTodo };
        setTodoList({ todo: [...todoList.todo, newTodoObj] });
        setNewTodo('');
    };

    const handleToggleAll = () => {
        const updatedTodoList = {
            todo: todoList.todo.map((todo) => ({ ...todo, done: !todo.done })),
        };
        setTodoList(updatedTodoList);
    };

    const handleToggle = (index) => {
        const updatedTodoList = {
            todo: todoList.todo.map((todo, i) =>
                i === index ? { ...todo, done: !todo.done } : todo
            ),
        };
        setTodoList(updatedTodoList);
    };

    const handleDelete = (index) => {
        const updatedTodoList = {
            todo: todoList.todo.filter((todo, i) => i !== index),
        };
        setTodoList(updatedTodoList);
    };

    const handleClearCompleted = () => {
        const updatedTodoList = {
            todo: todoList.todo.filter((todo) => !todo.done),
        };
        setTodoList(updatedTodoList);
    };

    const handleEdit = (index) => {
        setEditingIndex(index);
        setEditingText(todoList.todo[index].text);
    };

    const handleEditChange = (e) => {
        setEditingText(e.target.value);
    };

    const handleEditSubmit = (index) => {
        if (!editingText.trim()) {
            handleDelete(index); 
            return;
        }
        const updatedTodoList = {
            todo: todoList.todo.map((todo, i) =>
                i === index ? { ...todo, text: editingText } : todo
            ),
        };
        setTodoList(updatedTodoList);
        setEditingIndex(null);
    };


    const filteredTodoList =
        activeFilter === 'all'
            ? todoList.todo
            : activeFilter === 'active'
                ? todoList.todo.filter((todo) => !todo.done)
                : todoList.todo.filter((todo) => todo.done);

    const todoLeft = todoList.todo.filter((todo) => !todo.done).length;
    const todoDone = todoList.todo.filter((todo) => todo.done).length;

    return (
        <section style={{ borderRadius: '1%' }} className="todoapp" mv-app="todoapp">
            <header className="header">
                <h1>To Do App</h1>
                <form onSubmit={handleSubmit} mv-action="set(newTodo, newTodo.trim()), if(newTodo != '', add({done: false, text: newTodo}, todo) & set(newTodo, ''))">
                    <input
                        className="new-todo"
                        placeholder="Yeni Bir Görev Ekle"
                        autoFocus
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        property="newTodo"
                    />
                </form>
            </header>

            <section className="main" hidden={todoList.todo.length === 0}>
                <input
                    className="toggle-all"
                    type="checkbox"
                    checked={todoLeft === 0}
                    onChange={handleToggleAll}
                    property="toggleAll"
                />
                {/* <label htmlFor="toggle-all" mv-action="set(done, !toggleAll)">
                    Mark all as complete
                </label> */}

                <ul className="todo-list">
                    {filteredTodoList.map((todo, index) => (
                        <li
                            key={index}
                            className={`${todo.done ? 'completed' : ''} ${editingIndex === index ? 'editing' : ''
                                }`}
                            hidden={
                                (todo.done && activeFilter === 'active') ||
                                (!todo.done && activeFilter === 'completed')
                            }
                            mv-multiple="todo"
                        >
                            <div className="view">
                                <input
                                    className="toggle"
                                    type="checkbox"
                                    checked={todo.done}
                                    onChange={() => handleToggle(index)}
                                    property="done"
                                />
                                <label
                                    onClick={() => {
                                        handleEdit(index);
                                        setEditingText(todo.text);
                                        setTimeout(() => {
                                            const input = document.querySelector('.editing .edit');
                                            input && input.select(); // input varsa seçili hale getir
                                        }, 0);
                                    }}
                                    property="text"
                                >
                                    {todo.text}
                                </label>

                                <button
                                    className="destroy"
                                    onClick={() => handleDelete(index)}
                                    mv-action="delete(todo)"
                                ></button>
                            </div>
                            <input
                                className="edit"
                                value={editingText}
                                onChange={handleEditChange}
                                onBlur={() => handleEditSubmit(index)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleEditSubmit(index);
                                    if (e.key === 'Escape') {
                                        setEditingIndex(null);
                                        setEditingText('');
                                    }
                                }}
                            />
                        </li>
                    ))}
                </ul>
            </section>

            <footer className="footer" hidden={todoList.todo.length === 0}>
                <span className="todo-count">
                    <strong mv-value="todoLeft">{todoLeft}</strong>{' '}
                    görev kaldı
                </span>

                <ul className="filters">
                    <li>
                        <a
                            href="#/"
                            className={`${activeFilter === 'all' ? 'selected' : ''}`}
                            onClick={() => setActiveFilter('all')}
                            mv-action="set(activeFilter, 'all')"
                        >
                            Hepsini Gör
                        </a>
                    </li>
                    <li>
                        <a
                            href="#/"
                            className={`${activeFilter === 'active' ? 'selected' : ''}`}
                            onClick={() => setActiveFilter('active')}
                            mv-action="set(activeFilter, 'active')"
                        >
                            Aktif
                        </a>
                    </li>
                    <li>
                        <a
                            href="#/"
                            className={`${activeFilter === 'completed' ? 'selected' : ''}`}
                            onClick={() => setActiveFilter('completed')}
                            mv-action="set(activeFilter, 'completed')"
                        >
                            Tamamlanan
                        </a>
                    </li>
                </ul>

                <button
                    className="clear-completed"
                    onClick={handleClearCompleted}
                    hidden={todoDone === 0}
                    mv-action="delete(todo where done)"
                >
                    Tamamlananları Sil
                </button>
            </footer>
        </section>
    );
}

export default MainPage;
