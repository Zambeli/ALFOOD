import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import http from "../../../http";
import type ITag from "../../../interfaces/ITag";
import type IRestaurante from "../../../interfaces/IRestaurante";
import { useParams } from "react-router-dom";
import type IPrato from "../../../interfaces/IPrato";

const FormularioPrato = () => {
  const [nomePrato, setNomePrato] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tags, setTags] = useState<ITag[]>([]);
  const [tag, setTag] = useState("");
  const [imagem, setImagem] = useState<File | null | string>(null);

  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [restaurante, setRestaurante] = useState("");

  const parametros = useParams();

  useEffect(() => {
    if (parametros.id) {
      http.get<IPrato>(`/pratos/${parametros.id}/`).then((resposta) => {
        setNomePrato(resposta.data.nome);
        setDescricao(resposta.data.descricao);
        setTag(resposta.data.tag);
        setImagem(resposta.data.imagem);
        setRestaurante(String(resposta.data.restaurante));
      });
    }

    http
      .get<{ tags: ITag[] }>("tags/")
      .then((resposta) => setTags(resposta.data.tags));

    http
      .get<IRestaurante[]>("restaurantes/")
      .then((resposta) => setRestaurantes(resposta.data));
  }, [parametros.id]);

  const selecionarArquivo = (evento: React.ChangeEvent<HTMLInputElement>) => {
    if (evento.target.files?.length) {
      setImagem(evento.target.files[0]);
    } else {
      setImagem(null);
    }
  };

  const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    const formData = new FormData();

    formData.append("nome", nomePrato);
    formData.append("tag", tag);
    formData.append("descricao", descricao);
    formData.append("restaurante", restaurante);

    if (imagem) {
      formData.append("imagem", imagem);
    }

    if (parametros.id) {
      http.put(`/pratos/${parametros.id}/`, {
        nome: nomePrato,
        tag: tag,
        descricao: descricao,
        restaurante: restaurante,
      });

      alert("Prato alterado com sucesso!");
    } else {
      http
        .request({
          url: "pratos/",
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: formData,
        })
        .then(() => {
          alert("prato cadastrado com sucesso");
          setDescricao("");
          setNomePrato("");
          setTag("");
          setRestaurante("");
        })
        .catch((erro) => console.log(erro));
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexGrow: 1,
        }}
      >
        <Typography component="h1" variant="h6">
          {" "}
          Formulário de Pratos{" "}
        </Typography>
        <Box component="form" onSubmit={aoSubmeterForm} sx={{ width: "100%" }}>
          <TextField
            value={nomePrato}
            onChange={(evento) => setNomePrato(evento.target.value)}
            label="Nome do Prato"
            variant="standard"
            fullWidth
            required
            margin="dense"
          />
          <TextField
            value={descricao}
            onChange={(evento) => setDescricao(evento.target.value)}
            label="Descrição do Prato"
            variant="standard"
            fullWidth
            required
            margin="dense"
          />
          <FormControl margin="dense" fullWidth>
            <InputLabel id="select-tag">Tag</InputLabel>
            <Select
              labelId="select-tag"
              value={tag}
              onChange={(evento) => setTag(evento.target.value)}
            >
              {tags.map((tag) => (
                <MenuItem key={tag.id} value={tag.value}>
                  {tag.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl margin="dense" fullWidth>
            <InputLabel id="select-restaurante">Restaurante</InputLabel>
            <Select
              labelId="select-restaurante"
              value={restaurante}
              onChange={(evento) => setRestaurante(evento.target.value)}
            >
              {restaurantes.map((restaurante) => (
                <MenuItem key={restaurante.id} value={restaurante.id}>
                  {restaurante.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <input type="file" onChange={selecionarArquivo} />

          <Button
            sx={{ marginTop: 1 }}
            type="submit"
            fullWidth
            variant="outlined"
          >
            Salvar
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default FormularioPrato;
