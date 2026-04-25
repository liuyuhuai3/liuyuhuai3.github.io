import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Background,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  useEdgesState,
  useNodesState
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./styles.css";

const codeRows = [
  "const focus = ['finance', 'data', 'ai'];",
  "signals.clean().label().compare();",
  "attribution.align({ utm: true, events: true });",
  "roi.measure({ baseline: 'market-adjusted' });",
  "research.mapCycle(['rates', 'ppi', 'dividend']);",
  "agents.compose(report => report.explainable);",
  "logs.trace('workflow', 'decision', 'result');",
  "export default StructuredJudgment;"
];

const timeline = [
  {
    period: "2025.10 - 2026.02",
    company: "KuCoin",
    role: "运营与数据分析实习生",
    summary: "围绕交易活动分析、用户归因与 ROI 评估，处理数据如何真正支持业务判断的问题。",
    points: [
      "梳理交易活动指标，明确活动期与基准期统计口径，支持活动效果分析。",
      "设计基于 UTM 与多事件埋点的用户级归因与去重逻辑，提升数据一致性。",
      "结合行情修正系数评估活动真实增量，分析活动带来的实际 ROI。",
      "对齐埋点、业务看板与报名系统数据，定位偏差来源并统一统计口径。"
    ]
  },
  {
    period: "2024.06 - 2024.09",
    company: "国金证券股份有限公司",
    role: "策略实习生",
    summary: "围绕 A 股流动性、高股息策略和宏观周期做持续跟踪与研究支持。",
    points: [
      "基于 Wind API 获取北向资金、ETF 申赎及行业换手率等数据，完成整理与更新。",
      "结合财务报表与行情数据，设计高股息策略筛选逻辑，筛选潜在标的。",
      "开展中美经济周期对比研究，分析美债利率、国内 PPI 等因子与红利资产表现。",
      "构建市场热力图，观察市场结构变化与行业轮动特征。"
    ]
  },
  {
    period: "2024.09 - 2025.04",
    company: "武夷旅游集团",
    role: "投融资部实习生",
    summary: "参与融资资料准备和流程跟进，接触真实业务协作与投融资推进节奏。",
    points: [
      "协助整理与撰写融资材料，参与基础财务与项目资料准备。",
      "跟进融资流程进度，对接内部业务部门，推进资料整理与沟通。",
      "参与对外沟通流程，了解私募机构与投资顾问相关业务模式。"
    ]
  }
];

const skills = [
  {
    label: "数据分析",
    items: ["SQL", "Pandas", "Excel", "指标体系设计", "用户归因", "ROI 分析"]
  },
  {
    label: "AI / 机器学习",
    items: ["NLP", "LoRA 微调", "LLM 应用", "分析自动化流程"]
  },
  {
    label: "金融分析",
    items: ["财务分析", "量化选股", "宏观分析"]
  },
  {
    label: "工作方式",
    items: ["结构化梳理", "多源数据整合", "指标口径统一", "流程追踪与复盘"]
  }
];

const flowStorageKey = "personal-website:stock-flow-layout";

const flowInitialNodes = [
  {
    id: "input",
    type: "analysis",
    position: { x: 40, y: 245 },
    data: { title: "用户提问", kicker: "Input", variant: "input" }
  },
  {
    id: "extraction",
    type: "analysis",
    position: { x: 315, y: 222 },
    data: { title: "关键信息提取", kicker: "Parsing", variant: "parsing" }
  },
  {
    id: "company",
    type: "analysis",
    position: { x: 334, y: 384 },
    data: { title: "公司名", variant: "chip", compact: true }
  },
  {
    id: "ticker",
    type: "analysis",
    position: { x: 468, y: 384 },
    data: { title: "股票代码", variant: "chip", compact: true }
  },
  {
    id: "fundamental",
    type: "analysis",
    position: { x: 690, y: 70 },
    data: { title: "基本面分析", kicker: "Agent", subtitle: "Fundamental Agent", variant: "agent" }
  },
  {
    id: "technical",
    type: "analysis",
    position: { x: 690, y: 190 },
    data: { title: "技术分析", kicker: "Agent", subtitle: "Technical Agent", variant: "agent" }
  },
  {
    id: "valuation",
    type: "analysis",
    position: { x: 690, y: 310 },
    data: { title: "估值分析", kicker: "Agent", subtitle: "Valuation Agent", variant: "agent" }
  },
  {
    id: "news",
    type: "analysis",
    position: { x: 690, y: 430 },
    data: { title: "新闻分析", kicker: "Agent", subtitle: "News Agent", variant: "agent" }
  },
  {
    id: "summary",
    type: "analysis",
    position: { x: 986, y: 245 },
    data: { title: "总结 Agent", kicker: "Synthesis", variant: "summary" }
  },
  {
    id: "output",
    type: "analysis",
    position: { x: 1186, y: 245 },
    data: { title: "模型回复", kicker: "Output", variant: "output" }
  }
];

const flowInitialEdges = [
  { id: "input-extraction", source: "input", target: "extraction" },
  { id: "extraction-company", source: "extraction", target: "company", sourceHandle: "bottom", targetHandle: "top" },
  { id: "extraction-ticker", source: "extraction", target: "ticker", sourceHandle: "bottom", targetHandle: "top" },
  { id: "extraction-fundamental", source: "extraction", target: "fundamental" },
  { id: "extraction-technical", source: "extraction", target: "technical" },
  { id: "extraction-valuation", source: "extraction", target: "valuation" },
  { id: "extraction-news", source: "extraction", target: "news" },
  { id: "fundamental-summary", source: "fundamental", target: "summary" },
  { id: "technical-summary", source: "technical", target: "summary" },
  { id: "valuation-summary", source: "valuation", target: "summary" },
  { id: "news-summary", source: "news", target: "summary" },
  { id: "summary-output", source: "summary", target: "output" }
];

const flowNodeTypes = {
  analysis: AnalysisNode
};

const flowDefaultEdgeOptions = {
  type: "default",
  animated: true
};

const flowAutoLayoutPositions = {
  input: { x: 70, y: 250 },
  extraction: { x: 340, y: 228 },
  company: { x: 360, y: 390 },
  ticker: { x: 500, y: 390 },
  fundamental: { x: 710, y: 64 },
  technical: { x: 710, y: 186 },
  valuation: { x: 710, y: 308 },
  news: { x: 710, y: 430 },
  summary: { x: 1000, y: 250 },
  output: { x: 1200, y: 250 }
};

function getStoredFlowPositions() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(flowStorageKey);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function buildNodesWithPositions(positions) {
  return flowInitialNodes.map((node) => ({
    ...node,
    position: positions?.[node.id] ?? node.position
  }));
}

function saveFlowPositions(nodes) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const positions = Object.fromEntries(nodes.map((node) => [node.id, node.position]));
    window.localStorage.setItem(flowStorageKey, JSON.stringify(positions));
  } catch {
    // Ignore storage failures and keep the canvas usable.
  }
}

function AnalysisNode({ data }) {
  const isChip = data.variant === "chip";

  return (
    <div className={`analysis-node ${data.variant}${data.compact ? " compact" : ""}`}>
      <Handle className="analysis-handle" type="target" position={Position.Left} />
      <Handle className="analysis-handle" id="top" type="target" position={Position.Top} />

      {data.kicker ? <span className="node-kicker">{data.kicker}</span> : null}
      {data.variant === "agent" && data.subtitle ? <small className="node-subtitle">{data.subtitle}</small> : null}
      <strong>{data.title}</strong>
      {data.variant !== "agent" && data.subtitle ? <small className="node-subtitle">{data.subtitle}</small> : null}

      <Handle className="analysis-handle" type="source" position={Position.Right} />
      {isChip ? <Handle className="analysis-handle" id="top-source" type="source" position={Position.Top} /> : null}
      <Handle className="analysis-handle" id="bottom" type="source" position={Position.Bottom} />
    </div>
  );
}

function FlowDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState(() => buildNodesWithPositions(getStoredFlowPositions()));
  const [edges, , onEdgesChange] = useEdgesState(flowInitialEdges);
  const { fitView } = useReactFlow();

  useEffect(() => {
    saveFlowPositions(nodes);
  }, [nodes]);

  const applyLayout = (positions) => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => ({
        ...node,
        position: positions[node.id] ?? node.position
      }))
    );

    window.requestAnimationFrame(() => {
      fitView({ duration: 500, padding: 0.16, minZoom: 0.72 });
    });
  };

  const handleResetLayout = () => {
    window.localStorage.removeItem(flowStorageKey);
    applyLayout(Object.fromEntries(flowInitialNodes.map((node) => [node.id, node.position])));
  };

  const handleAutoLayout = () => {
    applyLayout(flowAutoLayoutPositions);
  };

  return (
    <div className="flow-shell">
      <div className="flow-shell-copy">
        <div className="flow-shell-meta">
          <span>React Flow Canvas</span>
          <p>支持缩放、拖动画布、小地图和布局记忆，节点移动时曲线连线会自动跟随。</p>
        </div>
        <div className="flow-shell-actions">
          <button className="flow-action" type="button" onClick={handleAutoLayout}>
            自动整理布局
          </button>
          <button className="flow-action subtle" type="button" onClick={handleResetLayout}>
            恢复默认布局
          </button>
        </div>
      </div>

      <div className="flow-canvas">
        <ReactFlow
          colorMode="light"
          defaultEdgeOptions={flowDefaultEdgeOptions}
          defaultViewport={{ x: -40, y: 0, zoom: 0.93 }}
          edges={edges}
          fitView
          fitViewOptions={{ padding: 0.16, minZoom: 0.72 }}
          maxZoom={1.55}
          minZoom={0.48}
          nodeTypes={flowNodeTypes}
          nodes={nodes}
          nodesConnectable={false}
          onEdgesChange={onEdgesChange}
          onNodesChange={onNodesChange}
          panOnDrag
          proOptions={{ hideAttribution: true }}
          selectionOnDrag={false}
        >
          <Background color="rgba(135, 133, 162, 0.14)" gap={20} size={1} />
          <MiniMap
            className="flow-minimap"
            maskColor="rgba(248, 246, 255, 0.72)"
            nodeBorderRadius={10}
            nodeColor={(node) => {
              const variant = node.data?.variant;

              if (variant === "input") return "#f9e7a6";
              if (variant === "parsing") return "#dfe4ff";
              if (variant === "agent") return "#f8dfe4";
              if (variant === "summary") return "#dddfff";
              if (variant === "output") return "#7c7aa8";
              return "#d7f3eb";
            }}
            pannable
            zoomable
          />
          <Controls className="flow-controls" position="bottom-left" showInteractive={false} />
        </ReactFlow>
      </div>
    </div>
  );
}

function App() {
  const [entered, setEntered] = useState(false);
  const showcaseRef = useRef(null);

  const enterShowcase = () => {
    setEntered(true);
    window.requestAnimationFrame(() => {
      showcaseRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <main className={`site-shell ${entered ? "is-entered" : ""}`}>
      <section className="hero" aria-label="Intro">
        <div className="hero-copy">
          <p className="eyebrow">LIU XIAONI / PERSONAL ARCHIVE</p>
          <h1>把复杂信息整理成可执行的判断</h1>
          <p className="lead">
            我关注金融、数据与 AI 工具如何一起支撑分析与决策。
          </p>
          <div className="hero-actions">
            <button className="enter-button" onClick={enterShowcase}>
              进入档案页
            </button>
            <a className="link-button" href="mailto:liuyuhuai3@gmail.com">
              联系我
            </a>
          </div>
        </div>

        <button className="mac-stage" onClick={enterShowcase} aria-label="Enter archive">
          <div className="monitor">
            <div className="camera" />
            <div className="screen">
              <div className="screen-toolbar">
                <span />
                <span />
                <span />
                <strong>liuxiaoni.archive</strong>
              </div>
              <div className="code-window">
                <div className="code-scroll">
                  {[...codeRows, ...codeRows].map((row, index) => (
                    <p key={`${row}-${index}`}>
                      <span>{String((index % codeRows.length) + 1).padStart(2, "0")}</span>
                      {row}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="screen-caption">
            <span>Click to enter</span>
            <span>finance / data / AI</span>
          </div>
          <div className="stand" />
          <div className="base" />
        </button>
      </section>

      <section className="showcase" aria-label="Archive" ref={showcaseRef}>
        <div className="archive-layout">
          <aside className="archive-sidebar">
            <div className="sidebar-block">
              <p className="eyebrow">Profile</p>
              <h2>刘小妮</h2>
              <p className="sidebar-lead">
                目前就读于香港中文大学信息科学与技术管理硕士，本科毕业于东北大学金融学。
                我的兴趣主要集中在金融分析、数据方法和 AI 应用的交叉地带。
              </p>
              <p className="sidebar-copy">
                过去的经历里，我做过策略研究、活动数据分析、融资流程支持，也尝试把投资分析流程做成更自动化、更可追踪的系统。
                相比单点技能，我更在意如何把复杂问题拆开：统一口径、整理信号、建立流程，再把结果变成可以解释和复盘的判断。
              </p>
            </div>

            <div className="sidebar-block compact">
              <p className="eyebrow">Contact</p>
              <a href="mailto:liuyuhuai3@gmail.com">liuyuhuai3@gmail.com</a>
              <a href="https://liuyuhuai3.github.io/" target="_blank" rel="noreferrer">
                liuyuhuai3.github.io
              </a>
            </div>

            <div className="sidebar-block compact">
              <p className="eyebrow">Focus</p>
              <ul className="tag-list">
                <li>金融分析</li>
                <li>数据方法</li>
                <li>LLM 应用</li>
                <li>分析自动化</li>
              </ul>
            </div>
          </aside>

          <div className="archive-main">
            <section className="archive-section">
              <div className="section-head stacked">
                <p className="eyebrow">Selected Path</p>
                <h2>经历时间线</h2>
              </div>

              <div className="timeline">
                {timeline.map((item) => (
                  <article className="timeline-item" key={`${item.company}-${item.period}`}>
                    <div className="timeline-meta">
                      <span>{item.period}</span>
                    </div>
                    <div className="timeline-content">
                      <h3>{item.company}</h3>
                      <p className="meta">{item.role}</p>
                      <p className="summary">{item.summary}</p>
                      <ul>
                        {item.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="archive-section feature-panel">
              <div className="project-layout">
                <div className="project-copy project-header">
                  <div className="section-head stacked">
                    <p className="eyebrow">Featured Project</p>
                    <h2>AI 驱动的多 Agent 股票分析系统</h2>
                  </div>
                  <p className="feature-intro">
                    一个基于多 Agent 架构的股票分析系统，目标是把基本面、技术面、估值和新闻信息整合到同一条分析流程中，
                    让投资分析从数据获取到报告生成更加自动化。
                  </p>
                </div>

                <ReactFlowProvider>
                  <FlowDiagram />
                </ReactFlowProvider>

                <div className="project-notes">
                  <div>
                    <h3>系统设计</h3>
                    <p>
                      我负责设计多模块分析框架，整合财务数据、行情数据和新闻信息，并封装统一的数据获取与处理流程。
                    </p>
                  </div>
                  <div>
                    <h3>模型与优化</h3>
                    <p>
                      围绕金融新闻构建情感与风险分类模型，通过 NLP 和 LoRA 微调提取结构化信号，并做误差分析与稳定性优化。
                    </p>
                  </div>
                  <div>
                    <h3>最终结果</h3>
                    <p>
                      建立分析日志体系，让系统从用户提问到结构化投资分析报告生成形成一条可追踪、可解释的自动化链路。
                    </p>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
