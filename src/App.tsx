import { useState } from 'react';
import './App.css';

type Todo = {
  text: string;
  checked: boolean;
};

type Rarity = 'common' | 'rare' | 'ssr';

type CollectionItem = {
  name: string;
  rarity: Rarity;
  count: number;
};

type Collection = {
  [emoji: string]: CollectionItem;
};

const gachaPool: { emoji: string; name: string; rarity: Rarity }[] = [
  // Common
  { emoji: "🐱", name: "猫", rarity: "common" },
  { emoji: "🐶", name: "犬", rarity: "common" },
  { emoji: "🐦", name: "鳥", rarity: "common" },
  { emoji: "🐭", name: "ネズミ", rarity: "common" },
  { emoji: "🐸", name: "カエル", rarity: "common" },
  { emoji: "🐰", name: "ウサギ", rarity: "common" },
  { emoji: "🐢", name: "カメ", rarity: "common" },
  { emoji: "🐴", name: "馬", rarity: "common" },
  { emoji: "🐧", name: "ペンギン", rarity: "common" },

  // Rare
  { emoji: "🦊", name: "狐", rarity: "rare" },
  { emoji: "🐼", name: "パンダ", rarity: "rare" },
  { emoji: "🦉", name: "フクロウ", rarity: "rare" },
  { emoji: "🐨", name: "コアラ", rarity: "rare" },
  { emoji: "🦁", name: "ライオン", rarity: "rare" },
  { emoji: "🐯", name: "トラ", rarity: "rare" },

  // SSR
  { emoji: "🐉", name: "ドラゴン", rarity: "ssr" },
  { emoji: "🦄", name: "ユニコーン", rarity: "ssr" },
  { emoji: "👑", name: "王冠", rarity: "ssr" },
];

// ランクごとの枠色
const rankColors: Record<Rarity, string> = {
  common: 'green',
  rare: 'blue',
  ssr: 'red'
};

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [collection, setCollection] = useState<Collection>({});
  const [gachaTickets, setGachaTickets] = useState(0);
  const [message, setMessage] = useState('');

  const addTodo = () => {
    if (input.trim() === '') return;
    setTodos([...todos, { text: input, checked: false }]);
    setInput('');
  };

  const toggleCheck = (index: number) => {
    const newTodos = [...todos];
    newTodos[index].checked = !newTodos[index].checked;
    setTodos(newTodos);
  };

  const handleDelete = () => {
    const toDelete = todos.filter(todo => todo.checked);
    if (toDelete.length === 0) return;

    const newTodos = todos.filter(todo => !todo.checked);
    setTodos(newTodos);

    setGachaTickets(prev => prev + toDelete.length);
    setMessage(`削除した数: ${toDelete.length} → ガチャ券 ${toDelete.length} 枚ゲット！`);
  };

  const drawGacha = () => {
    if (gachaTickets <= 0) return;

    const rand = Math.random();
let rarity: Rarity;
if (rand < 0.65) rarity = 'common';  // 65%
else if (rand < 0.9) rarity = 'rare'; // 25% (0.65～0.9)
else rarity = 'ssr';                  // 10% (0.9～1)
    const candidates = gachaPool.filter(item => item.rarity === rarity);
    const result = candidates[Math.floor(Math.random() * candidates.length)];

    setCollection(prev => ({
      ...prev,
      [result.emoji]: prev[result.emoji]
        ? { ...prev[result.emoji], count: prev[result.emoji].count + 1 }
        : { name: result.name, rarity: result.rarity as Rarity, count: 1 }
    }));

    setGachaTickets(prev => prev - 1);
    setMessage(`${result.emoji} ${result.name} を手に入れた！残りガチャ券: ${gachaTickets - 1}`);
  };

  const hasChecked = todos.some(todo => todo.checked);

  return (
    <div id="root">
      <h1>Todo App</h1>

      {/* 入力欄と追加ボタン */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="新しいTodo"
        />
        <button onClick={addTodo}>追加</button>
      </div>

      <div className="divider"></div>

      {/* Todoリスト */}
      {todos.length === 0 ? (
        <div className="task-prompt">タスクを追加してください</div>
      ) : (
        <div className="task-prompt">
          {todos.map((todo, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <input
                type="checkbox"
                checked={todo.checked}
                onChange={() => toggleCheck(index)}
                style={{ marginRight: '0.5rem' }}
              />
              {todo.text}
            </div>
          ))}
        </div>
      )}

      {/* 削除ボタン */}
      {hasChecked && (
        <button
          onClick={handleDelete}
          style={{ color: 'red', marginTop: '1rem' }}
        >
          選択削除
        </button>
      )}

      {/* ガチャ結果メッセージ */}
      {message && (
        <div style={{ marginTop: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
          {message}
        </div>
      )}

      {/* ガチャ欄 */}
      {gachaTickets > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <button onClick={drawGacha}>ガチャを引く</button>
          <span style={{ marginLeft: '0.5rem' }}>残りガチャ券: {gachaTickets}</span>
        </div>
      )}

      {/* コレクション（ランク枠付き） */}
      <div style={{ marginTop: '2rem', textAlign: 'left' }}>
        <h2>コレクション</h2>
        {Object.keys(collection).length === 0 ? (
          <p>まだ何も持っていません</p>
        ) : (
          Object.entries(collection).map(([emoji, item]) => (
            <div
              key={emoji}
              style={{
                border: `2px solid ${rankColors[item.rarity]}`,
                padding: '0.5rem',
                marginBottom: '0.5rem',
                borderRadius: '5px'
              }}
            >
              {item.name} {emoji} × {item.count} ({item.rarity})
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;