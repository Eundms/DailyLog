import React from "react";
import "./index.css"
import CommitsGroupedByDate from "./components/ContributionGroupedByDate";
import CommitGraph from "./components/CommitGraph";

const App: React.FC = () => {

  return (
    <div>
      <h1>Log Today</h1>
      <CommitGraph username = "Eundms"/>
      <CommitsGroupedByDate username="Eundms" />
    </div>
  );
};

export default App;
