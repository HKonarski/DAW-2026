export type Category =
{
    alias: string;
    label: string;
}
export const categories: Category[] = 
[
    {alias: "todos", label: "Todos"},
    {alias: "lanches", label: "Lanches"},
    {alias: "porcoes", label: "Porções"},
    {alias: "bebidas", label: "Bebidas"},
    {alias: "sobremesas", label: "Sobremesas"},
];

/*"label": "Toddos"
{

*****
             <li>
                <button type="button" className="active">TODOS</button>
            </li>
           <li>
                <button type="button">LANCHES</button>
            </li>
           <li>
                <button type="button">PORÇÕES</button>
            </li>
           <li>
                <button type="button">BEBIDAS</button>
            </li>
           <li>
                <button type="button">SOBREMESAS</button>
            </li>
}*/