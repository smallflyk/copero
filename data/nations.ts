export type Region='Europe'|'Americas'|'Africa'|'Asia'
export type Nation={name:string;region:Region;threshold:number;strength:number}
// Editorial game parameters, not real national rankings or player ratings.
const rows:[string,Region,number,number][]=[
 ['Argentina','Americas',70,86],['Brazil','Americas',71,88],['England','Europe',72,87],['France','Europe',72,89],['Germany','Europe',70,84],['Italy','Europe',69,82],['Japan','Asia',60,67],['Mexico','Americas',62,70],['Morocco','Africa',62,71],['Netherlands','Europe',69,82],['Nigeria','Africa',60,66],['Portugal','Europe',70,85],['South Korea','Asia',59,65],['Spain','Europe',72,88],['United States','Americas',61,68],['Uruguay','Americas',65,76],
 ['Belgium','Europe',66,77],['Colombia','Americas',64,74],['Chile','Americas',60,66],['Canada','Americas',58,64],['Senegal','Africa',63,72],['Algeria','Africa',60,66],['Egypt','Africa',60,67],['Ghana','Africa',58,63],['Cameroon','Africa',58,64],['Tunisia','Africa',57,62],['Australia','Asia',60,68],['Iran','Asia',61,69],['Saudi Arabia','Asia',56,61],['Qatar','Asia',54,58],['China','Asia',52,55],['Iraq','Asia',55,60],
]
export const nations:Nation[]=rows.map(([name,region,threshold,strength])=>({name,region,threshold,strength}))
export function getNation(name:string):Nation {const nation=nations.find(n=>n.name===name);if(!nation)throw new Error('Unknown national team.');return nation}
