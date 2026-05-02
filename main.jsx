import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Home, BookOpen, Images, WalletCards, StickyNote, Plus, Search, Heart,
  Trash2, Camera, CheckCircle2, CalendarDays, PiggyBank, Sparkles, RotateCcw,
  X, Upload, Bell, Gift, Smile, Coffee, Moon, Sun
} from 'lucide-react'
import './styles.css'

const STORAGE_KEY = 'between-us-pwa-data-v1'

const todayCN = new Date().toLocaleDateString('zh-CN', {
  month: 'long',
  day: 'numeric',
  weekday: 'long'
})

const defaultData = {
  startDate: '2024-08-20',
  mood: 'sunny',
  records: [
    {
      id: crypto.randomUUID(),
      author: 'Nancy',
      text: '今天把我们的 App 原型变成可以安装的 PWA 啦，感觉像把回忆装进一个小房子里。',
      date: '今天 21:18',
      tag: '日常',
      likes: 12,
      image: '',
      mine: true
    },
    {
      id: crypto.randomUUID(),
      author: 'Partner',
      text: '晚饭后散步，路灯和风都刚刚好。记得下次还要买那家草莓蛋糕。',
      date: '昨天 20:42',
      tag: '约会',
      likes: 8,
      image: '',
      mine: false
    },
    {
      id: crypto.randomUUID(),
      author: 'Nancy',
      text: '预算页面终于能记录支出了，旅行基金也要一点点攒起来。',
      date: '周三 09:05',
      tag: '计划',
      likes: 5,
      image: '',
      mine: true
    }
  ],
  albums: [
    {
      id: crypto.randomUUID(),
      title: '第一次旅行',
      date: '2025.04.18',
      image: 'linear-gradient(135deg, #fbcfe8, #fda4af, #fed7aa)',
      note: '海边、晚霞和两杯冰咖啡'
    },
    {
      id: crypto.randomUUID(),
      title: '纪念日晚餐',
      date: '2025.05.20',
      image: 'linear-gradient(135deg, #fecdd3, #f9a8d4, #ddd6fe)',
      note: '那天的甜点很好吃'
    },
    {
      id: crypto.randomUUID(),
      title: '周末散步',
      date: '2025.07.06',
      image: 'linear-gradient(135deg, #fde68a, #fdba74, #f0abfc)',
      note: '阳光正好'
    }
  ],
  expenses: [
    { id: crypto.randomUUID(), title: '晚餐', category: '约会', amount: 168, date: '今天' },
    { id: crypto.randomUUID(), title: '电影票', category: '娱乐', amount: 92, date: '昨天' },
    { id: crypto.randomUUID(), title: '旅行存款', category: '旅行', amount: 500, date: '周一' },
    { id: crypto.randomUUID(), title: '小礼物', category: '礼物', amount: 129, date: '上周' }
  ],
  budgetLimit: 3000,
  memos: [
    { id: crypto.randomUUID(), title: '周六去拍证件照旁边那家咖啡店', type: '待办', done: false, remind: '周六 14:00' },
    { id: crypto.randomUUID(), title: '周年日准备手写信和小蛋糕', type: '惊喜', done: false, remind: '5月20日' },
    { id: crypto.randomUUID(), title: '想一起看的电影清单：Before Sunrise / La La Land', type: '灵感', done: true, remind: '' }
  ]
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : defaultData
  } catch {
    return defaultData
  }
}

function calcDays(startDate) {
  const start = new Date(startDate)
  const now = new Date()
  return Math.max(1, Math.ceil((now - start) / (1000 * 60 * 60 * 24)))
}

function App() {
  const [tab, setTab] = useState('home')
  const [data, setData] = useState(loadData)
  const [modal, setModal] = useState(null)
  const [query, setQuery] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  const days = calcDays(data.startDate)
  const totalSpent = data.expenses.reduce((sum, item) => sum + Number(item.amount), 0)
  const remaining = Math.max(0, data.budgetLimit - totalSpent)
  const budgetPercent = Math.min(100, Math.round((totalSpent / data.budgetLimit) * 100))

  const filteredRecords = data.records.filter(item =>
    item.text.toLowerCase().includes(query.toLowerCase()) ||
    item.tag.toLowerCase().includes(query.toLowerCase())
  )

  const filteredMemos = data.memos.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.type.toLowerCase().includes(query.toLowerCase())
  )

  const resetDemo = () => {
    localStorage.removeItem(STORAGE_KEY)
    setData(defaultData)
    setQuery('')
    setTab('home')
  }

  const addRecord = (payload) => {
    setData(prev => ({
      ...prev,
      records: [{
        id: crypto.randomUUID(),
        author: 'Nancy',
        text: payload.text,
        date: '刚刚',
        tag: payload.tag || '日常',
        image: payload.image || '',
        likes: 0,
        mine: true
      }, ...prev.records]
    }))
  }

  const addAlbum = (payload) => {
    setData(prev => ({
      ...prev,
      albums: [{
        id: crypto.randomUUID(),
        title: payload.title,
        date: new Date().toLocaleDateString('zh-CN'),
        image: payload.image || 'linear-gradient(135deg, #fbcfe8, #fecdd3, #fde68a)',
        note: payload.note || ''
      }, ...prev.albums]
    }))
  }

  const addExpense = (payload) => {
    setData(prev => ({
      ...prev,
      expenses: [{
        id: crypto.randomUUID(),
        title: payload.title,
        category: payload.category,
        amount: Number(payload.amount),
        date: '刚刚'
      }, ...prev.expenses]
    }))
  }

  const addMemo = (payload) => {
    setData(prev => ({
      ...prev,
      memos: [{
        id: crypto.randomUUID(),
        title: payload.title,
        type: payload.type,
        done: false,
        remind: payload.remind || ''
      }, ...prev.memos]
    }))
  }

  return (
    <div className="app-shell">
      <div className="phone-frame">
        <header className="topbar">
          <button className="ghost-btn" onClick={resetDemo} aria-label="Reset demo">
            <RotateCcw size={16} />
            Reset
          </button>
          <div className="brand">
            <span>Between</span>
            <b>Us</b>
          </div>
          <button className="avatar-btn" onClick={() => setModal('profile')}>
            <Heart size={18} />
          </button>
        </header>

        <main className="content">
          {tab === 'home' && (
            <HomePage
              days={days}
              todayCN={todayCN}
              data={data}
              setData={setData}
              totalSpent={totalSpent}
              remaining={remaining}
              budgetPercent={budgetPercent}
              setTab={setTab}
              openAdd={() => setModal('record')}
            />
          )}

          {tab === 'record' && (
            <RecordPage
              records={filteredRecords}
              query={query}
              setQuery={setQuery}
              setModal={setModal}
              setData={setData}
            />
          )}

          {tab === 'album' && (
            <AlbumPage
              albums={data.albums}
              setModal={setModal}
              setData={setData}
            />
          )}

          {tab === 'budget' && (
            <BudgetPage
              expenses={data.expenses}
              totalSpent={totalSpent}
              remaining={remaining}
              budgetPercent={budgetPercent}
              budgetLimit={data.budgetLimit}
              setModal={setModal}
              setData={setData}
            />
          )}

          {tab === 'memos' && (
            <MemosPage
              memos={filteredMemos}
              query={query}
              setQuery={setQuery}
              setModal={setModal}
              setData={setData}
            />
          )}
        </main>

        <button className="fab" onClick={() => setModal(tab === 'album' ? 'album' : tab === 'budget' ? 'expense' : tab === 'memos' ? 'memo' : 'record')}>
          <Plus size={26} />
        </button>

        <nav className="bottom-nav">
          <NavItem active={tab === 'home'} icon={<Home size={20}/>} label="Home" onClick={() => {setTab('home'); setQuery('')}} />
          <NavItem active={tab === 'record'} icon={<BookOpen size={20}/>} label="Record" onClick={() => {setTab('record'); setQuery('')}} />
          <NavItem active={tab === 'album'} icon={<Images size={20}/>} label="Album" onClick={() => {setTab('album'); setQuery('')}} />
          <NavItem active={tab === 'budget'} icon={<WalletCards size={20}/>} label="Budget" onClick={() => {setTab('budget'); setQuery('')}} />
          <NavItem active={tab === 'memos'} icon={<StickyNote size={20}/>} label="Memos" onClick={() => {setTab('memos'); setQuery('')}} />
        </nav>

        {modal && (
          <Modal title={modalTitle(modal)} onClose={() => setModal(null)}>
            {modal === 'record' && <RecordForm onSubmit={addRecord} onClose={() => setModal(null)} />}
            {modal === 'album' && <AlbumForm onSubmit={addAlbum} onClose={() => setModal(null)} />}
            {modal === 'expense' && <ExpenseForm onSubmit={addExpense} onClose={() => setModal(null)} />}
            {modal === 'memo' && <MemoForm onSubmit={addMemo} onClose={() => setModal(null)} />}
            {modal === 'profile' && <ProfileCard days={days} data={data} />}
          </Modal>
        )}
      </div>
    </div>
  )
}

function modalTitle(type) {
  return {
    record: '写一条新记录',
    album: '上传一张照片',
    expense: '添加一笔支出',
    memo: '新增备忘',
    profile: '我们的空间'
  }[type]
}

function NavItem({active, icon, label, onClick}) {
  return <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>{icon}<span>{label}</span></button>
}

function HomePage({days, todayCN, data, setData, totalSpent, remaining, budgetPercent, setTab, openAdd}) {
  const [note, setNote] = useState('')

  const saveToday = () => {
    if (!note.trim()) return
    setData(prev => ({
      ...prev,
      records: [{
        id: crypto.randomUUID(),
        author: 'Nancy',
        text: note.trim(),
        date: '刚刚',
        tag: '今日',
        likes: 0,
        image: '',
        mine: true
      }, ...prev.records]
    }))
    setNote('')
  }

  return <section className="page fade-in">
    <div className="hero-card">
      <div className="hero-copy">
        <p className="eyebrow">{todayCN}</p>
        <h1>我们已经一起走过</h1>
        <div className="days-line"><span>{days}</span> 天</div>
        <p className="soft-text">把日常、照片、预算和小提醒都放在这个只属于你们的小空间里。</p>
      </div>
      <div className="hero-bubble"><Heart size={42}/></div>
    </div>

    <div className="task-card">
      <div className="section-title">
        <div><b>今日小任务</b><p>给对方留一句话</p></div>
        <Gift size={22}/>
      </div>
      <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="例如：今天也辛苦啦，晚上一起散步吧。" />
      <button className="primary-btn" onClick={saveToday}>保存到 Record</button>
    </div>

    <div className="quick-grid">
      <button onClick={() => setTab('record')} className="mini-card"><BookOpen/><span>{data.records.length} 条记录</span></button>
      <button onClick={() => setTab('album')} className="mini-card"><Images/><span>{data.albums.length} 张照片</span></button>
      <button onClick={() => setTab('budget')} className="mini-card"><PiggyBank/><span>剩余 ¥{remaining}</span></button>
      <button onClick={() => setTab('memos')} className="mini-card"><Bell/><span>{data.memos.filter(m => !m.done).length} 个提醒</span></button>
    </div>

    <div className="glass-card">
      <div className="section-title">
        <div><b>本月预算</b><p>已用 ¥{totalSpent} / ¥{data.budgetLimit}</p></div>
        <span>{budgetPercent}%</span>
      </div>
      <div className="progress"><i style={{width: `${budgetPercent}%`}} /></div>
    </div>

    <div className="preview-row">
      <div className="section-title"><b>最近回忆</b><button onClick={() => setTab('album')}>查看全部</button></div>
      <div className="album-strip">
        {data.albums.slice(0,3).map(photo => <div className="strip-photo" key={photo.id} style={{background: photo.image}}><span>{photo.title}</span></div>)}
      </div>
    </div>
  </section>
}

function RecordPage({records, query, setQuery, setModal, setData}) {
  return <section className="page fade-in">
    <PageHead icon={<BookOpen/>} title="Record" subtitle="写下今天，也收藏昨天。" action={() => setModal('record')} />
    <SearchBar value={query} onChange={setQuery} placeholder="搜索记录或标签" />
    <div className="record-list">
      {records.map(item => (
        <article className="record-card" key={item.id}>
          <div className="record-meta">
            <div className="avatar-small">{item.author[0]}</div>
            <div><b>{item.author}</b><p>{item.date} · {item.tag}</p></div>
          </div>
          <p>{item.text}</p>
          {item.image && <img className="record-image" src={item.image} alt={item.tag} />}
          <div className="card-actions">
            <button onClick={() => setData(prev => ({...prev, records: prev.records.map(r => r.id === item.id ? {...r, likes: r.likes + 1} : r)}))}><Heart size={17}/> {item.likes}</button>
            {item.mine && <button onClick={() => setData(prev => ({...prev, records: prev.records.filter(r => r.id !== item.id)}))}><Trash2 size={17}/> 删除</button>}
          </div>
        </article>
      ))}
      {!records.length && <Empty text="没有找到相关记录" />}
    </div>
  </section>
}

function AlbumPage({albums, setModal, setData}) {
  const [view, setView] = useState(null)

  return <section className="page fade-in">
    <PageHead icon={<Images/>} title="Album" subtitle="把照片和瞬间收集起来。" action={() => setModal('album')} />
    <div className="masonry">
      {albums.map(photo => (
        <button className="photo-card" key={photo.id} onClick={() => setView(photo)}>
          <div className="photo-box" style={{background: photo.image}}>
            {photo.image?.startsWith('data:') && <img src={photo.image} alt={photo.title} />}
          </div>
          <b>{photo.title}</b>
          <p>{photo.date}</p>
        </button>
      ))}
    </div>
    {view && (
      <Modal title={view.title} onClose={() => setView(null)}>
        <div className="photo-preview" style={{background: view.image}}>
          {view.image?.startsWith('data:') && <img src={view.image} alt={view.title} />}
        </div>
        <p className="soft-text">{view.note}</p>
        <button className="danger-btn" onClick={() => { setData(prev => ({...prev, albums: prev.albums.filter(p => p.id !== view.id)})); setView(null) }}>
          <Trash2 size={17}/> 删除照片
        </button>
      </Modal>
    )}
  </section>
}

function BudgetPage({expenses, totalSpent, remaining, budgetPercent, budgetLimit, setModal, setData}) {
  const categories = ['全部', '约会', '娱乐', '旅行', '礼物', '生活']
  const [cat, setCat] = useState('全部')
  const list = cat === '全部' ? expenses : expenses.filter(e => e.category === cat)

  return <section className="page fade-in">
    <PageHead icon={<WalletCards/>} title="Budget" subtitle="一起计划，也一起生活。" action={() => setModal('expense')} />
    <div className="budget-card">
      <p>本月已用</p>
      <h2>¥{totalSpent}</h2>
      <span>预算 ¥{budgetLimit} · 剩余 ¥{remaining}</span>
      <div className="progress"><i style={{width: `${budgetPercent}%`}} /></div>
    </div>
    <div className="chips">{categories.map(c => <button className={cat === c ? 'chip active' : 'chip'} key={c} onClick={() => setCat(c)}>{c}</button>)}</div>
    <div className="expense-list">
      {list.map(item => (
        <div className="expense-row" key={item.id}>
          <div className="expense-icon"><Coffee size={18}/></div>
          <div><b>{item.title}</b><p>{item.category} · {item.date}</p></div>
          <strong>¥{item.amount}</strong>
          <button className="icon-danger" onClick={() => setData(prev => ({...prev, expenses: prev.expenses.filter(e => e.id !== item.id)}))}><Trash2 size={16}/></button>
        </div>
      ))}
    </div>
  </section>
}

function MemosPage({memos, query, setQuery, setModal, setData}) {
  return <section className="page fade-in">
    <PageHead icon={<StickyNote/>} title="Memos" subtitle="怕忘记的，就写在这里。" action={() => setModal('memo')} />
    <SearchBar value={query} onChange={setQuery} placeholder="搜索备忘、待办或灵感" />
    <div className="memo-list">
      {memos.map(item => (
        <div className={`memo-card ${item.done ? 'done' : ''}`} key={item.id}>
          <button onClick={() => setData(prev => ({...prev, memos: prev.memos.map(m => m.id === item.id ? {...m, done: !m.done} : m)}))}>
            <CheckCircle2 size={22}/>
          </button>
          <div>
            <b>{item.title}</b>
            <p>{item.type}{item.remind ? ` · ${item.remind}` : ''}</p>
          </div>
          <button className="icon-danger" onClick={() => setData(prev => ({...prev, memos: prev.memos.filter(m => m.id !== item.id)}))}><Trash2 size={16}/></button>
        </div>
      ))}
    </div>
  </section>
}

function PageHead({icon, title, subtitle, action}) {
  return <div className="page-head">
    <div className="page-icon">{icon}</div>
    <div><h2>{title}</h2><p>{subtitle}</p></div>
    <button onClick={action}><Plus size={18}/></button>
  </div>
}

function SearchBar({value, onChange, placeholder}) {
  return <label className="searchbar"><Search size={18}/><input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}/></label>
}

function Modal({title, onClose, children}) {
  return <div className="modal-backdrop">
    <div className="modal-card">
      <div className="modal-head"><b>{title}</b><button onClick={onClose}><X size={20}/></button></div>
      {children}
    </div>
  </div>
}

function RecordForm({onSubmit, onClose}) {
  const [text, setText] = useState('')
  const [tag, setTag] = useState('日常')
  const [image, setImage] = useState('')
  return <form className="form" onSubmit={e => {e.preventDefault(); if(!text.trim()) return; onSubmit({text, tag, image}); onClose()}}>
    <textarea value={text} onChange={e => setText(e.target.value)} placeholder="写下这一刻..." required/>
    <select value={tag} onChange={e => setTag(e.target.value)}>
      <option>日常</option><option>约会</option><option>计划</option><option>惊喜</option><option>今日</option>
    </select>
    <ImagePicker value={image} onChange={setImage} />
    <button className="primary-btn">发布记录</button>
  </form>
}

function AlbumForm({onSubmit, onClose}) {
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [image, setImage] = useState('')
  return <form className="form" onSubmit={e => {e.preventDefault(); if(!title.trim()) return; onSubmit({title, note, image}); onClose()}}>
    <input value={title} onChange={e => setTitle(e.target.value)} placeholder="照片标题" required/>
    <input value={note} onChange={e => setNote(e.target.value)} placeholder="一句备注" />
    <ImagePicker value={image} onChange={setImage} />
    <button className="primary-btn">保存照片</button>
  </form>
}

function ExpenseForm({onSubmit, onClose}) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('约会')
  const [amount, setAmount] = useState('')
  return <form className="form" onSubmit={e => {e.preventDefault(); if(!title.trim() || !amount) return; onSubmit({title, category, amount}); onClose()}}>
    <input value={title} onChange={e => setTitle(e.target.value)} placeholder="支出名称" required/>
    <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="金额" type="number" min="1" required/>
    <select value={category} onChange={e => setCategory(e.target.value)}>
      <option>约会</option><option>娱乐</option><option>旅行</option><option>礼物</option><option>生活</option>
    </select>
    <button className="primary-btn">添加支出</button>
  </form>
}

function MemoForm({onSubmit, onClose}) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState('待办')
  const [remind, setRemind] = useState('')
  return <form className="form" onSubmit={e => {e.preventDefault(); if(!title.trim()) return; onSubmit({title, type, remind}); onClose()}}>
    <input value={title} onChange={e => setTitle(e.target.value)} placeholder="备忘内容" required/>
    <select value={type} onChange={e => setType(e.target.value)}>
      <option>待办</option><option>惊喜</option><option>灵感</option><option>纪念日</option>
    </select>
    <input value={remind} onChange={e => setRemind(e.target.value)} placeholder="提醒时间，可不填" />
    <button className="primary-btn">保存备忘</button>
  </form>
}

function ImagePicker({value, onChange}) {
  return <div className="image-picker">
    <label>
      <Upload size={18}/>
      上传图片
      <input type="file" accept="image/*" onChange={e => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = () => onChange(reader.result)
        reader.readAsDataURL(file)
      }} />
    </label>
    {value && <img src={value} alt="preview" />}
  </div>
}

function ProfileCard({days, data}) {
  return <div className="profile-card">
    <div className="large-heart"><Heart size={52}/></div>
    <h2>Between Us</h2>
    <p>已相伴 {days} 天</p>
    <div className="profile-stats">
      <span>{data.records.length}<small>记录</small></span>
      <span>{data.albums.length}<small>照片</small></span>
      <span>{data.memos.length}<small>备忘</small></span>
    </div>
  </div>
}

function Empty({text}) {
  return <div className="empty"><Sparkles size={22}/><p>{text}</p></div>
}

createRoot(document.getElementById('root')).render(<App />)
