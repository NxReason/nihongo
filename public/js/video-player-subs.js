const subsContent = document.getElementById("subs-content");
const subsList = document.getElementById("subs-list");
const sgTemplate = document.querySelector(".subs-group-template");
sgTemplate.classList.remove("subs-group-template");
const SubsList = {
  subs: {},
  current: null,

  init() {},

  set(subsStr) {
    const groups = this.parse(subsStr);
    this.clear();
    this.render(groups);
  },

  parse(str) {
    const lines = str.split("\n");
    let lineGroups = [];
    let subGroups = [];
    for (let line of lines) {
      line = line.trim();
      // parse collected lines on empty line
      if (line === "") {
        // restart collecting when not enough lines
        if (lineGroups.length < 3) {
          // console.info(
          //   `Not enough data in the sub group, expected at least 3 lines, got ${lineGroups.length} ${lineGroups}`,
          // );
          lineGroups = [];
          continue;
        }

        // actual data parse & restart collecting
        subGroups.push(parseSubGroup(lineGroups));
        lineGroups = [];
        continue;
      }
      // collect line to group for later parsing
      lineGroups.push(line.trim());
    }
    return subGroups;
  },

  render(groups) {
    sgTemplate.style.display = "flex";
    for (let g of groups) {
      const li = sgTemplate.cloneNode(true);
      this.subs[g.ts.start.stamp] = {};
      this.subs[g.ts.start.stamp].data = g;
      this.subs[g.ts.start.stamp].node = li;
      li.dataset["ts"] = g.ts.start.stamp;

      const timeNode = li.querySelector(".subs-group-time");
      const { h, m, s } = g.ts.start;
      timeNode.textContent = `${h}:${m}:${s}`;

      const contentNode = li.querySelector(".subs-group-text");
      contentNode.innerHTML = g.content;

      subsList.appendChild(li);
    }
    sgTemplate.style.display = "none";
  },

  setSubClickCallback(fn) {
    subsList.addEventListener("click", (e) => {
      const sub = e.target.closest(".subs-group");
      if (sub) {
        const ts = parseFloat(sub.dataset["ts"]);
        fn(ts);
        this.updateCurrent(sub);
      }
    });
  },

  findSubByTimestamp(ts) {
    const stamps = Object.keys(this.subs);

    const bSearch = (ts, values, min, max) => {
      if (min >= values.length - 1) return values[values.length - 1];
      const index = Math.floor((min + max) / 2);

      const found =
        ts === values[index] || // separate to short curcuit
        (ts > values[index] && ts < values[index + 1]);
      if (found) return values[index];
      if (min === max) return 0;

      if (ts < values[index]) return bSearch(ts, values, min, index);
      if (ts > values[index]) return bSearch(ts, values, index + 1, max);
    };

    const currentSub = bSearch(ts, stamps, 0, stamps.length);
    return this.subs[currentSub];
  },

  updateCurrent(currentSub) {
    if (currentSub === this.current) return;

    for (let sub of Object.keys(this.subs)) {
      this.subs[sub]?.node.classList.remove("current");
    }
    currentSub.classList.add("current");
    this.current = currentSub;
    currentSub.scrollIntoView({ block: "center", behavior: "smooth" });
  },

  clear() {
    while (subsList.firstChild) {
      subsList.removeChild(subsList.firstChild);
    }
    this.subs = {};
  },
};

function parseSubGroup([pos, timestamp, ...content]) {
  const [startStr, endStr] = timestamp.split(" --> ");
  const [start, end] = [parseTimestamp(startStr), parseTimestamp(endStr)];

  return {
    pos,
    content: content.join("</br>"),
    ts: { start, end },
  };
}

function parseTimestamp(ts) {
  const [h, m, sms] = ts.split(":");
  const [s, ms] = sms.split(",");
  const stamp =
    parseFloat(ms) / 1000 +
    parseFloat(s) +
    parseFloat(m) * 60 +
    parseFloat(h) * 60 * 60;
  return {
    h,
    m,
    s,
    ms,
    stamp,
  };
}
