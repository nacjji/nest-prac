export const attachOffsetLimit = (page: number, per: number) => {
  if (!page || !per) return '';
  else {
    const offset = Number(page - 1) * Number(per);
    return ` LIMIT ${offset}, ${Number(per)}`;
  }
};
