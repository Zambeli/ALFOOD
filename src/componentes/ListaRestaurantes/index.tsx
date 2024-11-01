import { useEffect, useState } from "react";
import IRestaurante from "../../interfaces/IRestaurante";
import style from "./ListaRestaurantes.module.scss";
import Restaurante from "./Restaurante";
import axios, { type AxiosRequestConfig } from "axios";
import type { IPaginacao } from "../../interfaces/IPaginacao";

interface IParametrosBusca {
  ordering?: string;
  search?: string;
}

const ListaRestaurantes = () => {
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [proximaPagina, setProximaPagina] = useState("");
  const [paginaAnterior, setPaginaAnterior] = useState("");
  const [ordenacao, setOrdenacao] = useState("");

  const [busca, setBusca] = useState("");

  const conectaApi = (url: string, opcoes: AxiosRequestConfig = {}) => {
    axios
      .get<IPaginacao<IRestaurante>>(url, opcoes)
      .then((resposta) => {
        setRestaurantes(resposta.data.results);
        setProximaPagina(resposta.data.next);
        setPaginaAnterior(resposta.data.previous);
      })
      .catch((erro) => {
        console.log(erro);
      });
  };

  const buscar = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const opcoes = {
      params: {} as IParametrosBusca,
    };

    if (busca) {
      opcoes.params.search = busca;
    }

    if (ordenacao) {
      opcoes.params.ordering = ordenacao;
    }

    conectaApi("http://localhost:8000/api/v1/restaurantes/", opcoes);
  };

  useEffect(() => {
    conectaApi("http://localhost:8000/api/v1/restaurantes/");
  }, []);

  return (
    <section className={style.ListaRestaurantes}>
      <h1>
        Os restaurantes mais <em>bacanas</em>!
      </h1>
      <form onSubmit={buscar}>
        <div>
          <input
            type="text"
            placeholder="Procure um restaurante"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="select-ordenacao">Ordenação</label>
          <select
            name="select-ordenacao"
            id="select-ordenacao"
            value={ordenacao}
            onChange={(event) => setOrdenacao(event.target.value)}
          >
            <option value="">Padrão</option>
            <option value="id">Por ID</option>
            <option value="nome">Por Nome</option>
          </select>
        </div>
        <div>
          <button type="submit">Procurar</button>
        </div>
      </form>
      {restaurantes?.map((item) => (
        <Restaurante restaurante={item} key={item.id} />
      ))}

      <div className={style.divBotoes}>
        {paginaAnterior && (
          <button
            className={style.botoesPaginas}
            onClick={() => conectaApi(paginaAnterior)}
          >
            Ver menos
          </button>
        )}
        {proximaPagina && (
          <button
            className={style.botoesPaginas}
            onClick={() => conectaApi(proximaPagina)}
          >
            Ver mais
          </button>
        )}
      </div>
    </section>
  );
};

export default ListaRestaurantes;
