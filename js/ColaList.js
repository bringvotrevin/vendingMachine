export default class ColaList {
  colaList;

  get getList() {
    return this.colaList;
  }

  getDetail(name) {
    for (const list of this.colaList) {
      if (list.name === name) { return list; }
    }
  }

  async setColaList(resource) {
    try {
      const response = await fetch(resource);
      if (!response.ok) { throw new Error(`response status : ${response.status}`); }
      this.colaList = await response.json();
    } catch (e) {
      console.error(e);
    }
  }
}
