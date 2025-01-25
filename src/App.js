import "./style.css";
import React, { useEffect, useState } from "react";
import supabase from "./superbase";

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

function App() {
  const apptitle = "Today I Learned";
  const [showForm, setshowForm] = useState(false);
  const [showLists, setshowLists] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");

  let query = supabase.from("Today_I_Learned").select("*");

  if (currentCategory !== "all") query = query.eq("category", currentCategory);

  useEffect(
    function () {
      async function getLists() {
        setLoading(true);

        let { data: Today_I_Learned, error } = await query
          .order("votesInteresting", { ascending: false })
          .limit(100);

        if (!error) setshowLists(Today_I_Learned);
        else alert("There is an error!");
        setLoading(false);
      }

      getLists();
    },
    [currentCategory]
  );
  return (
    <>
      <header className="head">
        <div className="head_set">
          <img src="chatLogo.jpg" height="66" width="66" alt="logo" />
          <h1>{apptitle}</h1>
        </div>
        <button
          className="btn btn-large btn-open"
          onClick={() => setshowForm((show) => !show)}
        >
          {showForm ? "Close Form" : "Share a fact"}
        </button>
      </header>
      {showForm ? (
        <Newpopup setshowLists={setshowLists} setshowForm={setshowForm} />
      ) : null}
      <main className="main">
        <Categoryfilter setCurrentCategory={setCurrentCategory} />
        {Loading ? <Loader /> : <List lists={showLists} />}
      </main>
    </>
  );
}

function Loader() {
  return <p className="message">Loading...</p>;
}

function isValidURL(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

function Newpopup({ setshowLists, setshowForm }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const textLength = text.length;

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(text, source, category);
    if (text && isValidURL(source) && category && textLength <= 200) {
      // const newList = {
      //   id: Math.round(Math.random() * 1000),
      //   text,
      //   source,
      //   category,
      //   votesInteresting: 0,
      //   votesMindblowing: 0,
      //   votesFalse: 0,
      //   createdIn: new Date().getFullYear(),
      // };

      // setshowLists((lists) => [newList, ...lists]);
      setIsUploading(true); //36:22
      const { data: newList, error } = await supabase
        .from("Today_I_Learned")
        .insert([{ text, source, category }])
        .select();

      setshowLists((lists) => [newList[0], ...lists]);
      setText("");
      setSource("");
      setCategory("");
      setshowForm();
    }
  }

  // showLists is for save all initialFacts and send to List() function
  // setshowLists is a function and send new list to the initialFacts by using onSubmit()

  return (
    <form class="pop_up" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact with the world ..."
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
      <span>{200 - textLength}</span>
      <input
        type="text"
        placeholder="Trustworthy source ..."
        value={source}
        onChange={(e) => {
          setSource(e.target.value);
        }}
      />
      <select
        value={setCategory}
        onChange={(e) => {
          setCategory(e.target.value);
        }}
      >
        <option value="">Choose categroy:</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>
      <button class="btn btn-large">POST</button>
    </form>
  );
}

function Categoryfilter({ setCurrentCategory }) {
  const category = CATEGORIES;
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className="btn btn-all-category"
            onClick={() => setCurrentCategory("all")}
          >
            All
          </button>
        </li>
        {category.map((cat) => (
          <>
            <li key={cat.name} className="category">
              <button
                className="btn btn-category"
                style={{ backgroundColor: cat.color }}
                onClick={() => setCurrentCategory(cat.name)}
              >
                {cat.name}
              </button>
            </li>
          </>
        ))}
      </ul>
    </aside>
  );
}

function List(props) {
  // const list_content = initialFacts;
  return (
    <section>
      <ul>
        {props.lists.map((list) => (
          <li key={list.id} className="content">
            <p>
              {list.text}
              <a
                className="link"
                href={list.source}
                target="_blank"
                rel="noreferrer"
              >
                (Source)
              </a>
              <span
                className="tag"
                style={{
                  backgroundColor: CATEGORIES.find(
                    (cat) => cat.name === list.category
                  ).color,
                }}
              >
                {list.category}
              </span>
            </p>
            <div className="vote-button">
              <button>👍 {list.votesInteresting}</button>
              <button>😐 {list.votesMindblowing}</button>
              <button>🤬 {list.votesFalse}</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default App;
