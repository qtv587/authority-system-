//判断菜单节点是否是末级节点
export default function leafUtils() {
  const setLeaf = (arr) => {
    if (arr && arr.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].children && arr[i].children.length > 0) {
          arr[i].open = false;
          setLeaf(arr[i].children);
        } else {
          arr[i].open = true;
        }
      }
    }
    return arr;
  };
  return {
    setLeaf,
  };
}
