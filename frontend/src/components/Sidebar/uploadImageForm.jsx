import { useState } from "react";
import Card from "../Card";
import * as S from "./styles";
import UploadImage from '../../images/uploadImage.png';
import { useServices } from "../../hooks/useServices";
import Button from "../Button";
import { toast } from "react-hot-toast";

const UploadImageForm = ({ id, executeAction }) => {

    const [newImage, setNewImage] = useState(UploadImage);

    const readInput = (input) => {
        if (input.files && input.files[0]) {
            const reader = new FileReader();

            reader.onload = (e) => {
                setNewImage(e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    const handleUpload = (event) => {
        readInput(event.target)
    }

    const translateHttpError = (status) => {
        switch (status) {
            case 413:
                return "Imagem grande demais.";

            case 500:
            default:
                return "Houve um erro, tente novamente.";
        }
    }

    const handleSave = async () => {
        const data = {
            name: window.user.name,
            email: window.user.email,
            profile_image: newImage
        }
        const res = await useServices('users', 'PUT', window.user.id, data);

        if (res.status === 200) {
            window.user.profilePicture = newImage;
            window.sessionStorage.setItem('profileImage', newImage);
            toast.success("Imagem de Perfil atualizada com sucesso.");
            executeAction();
        } else {
            toast.error(res.statusText);
        }
    }

    return (
        <Card title="Atualizar Imagem de Perfil">
            <S.UpdateImagesHolder>
                <S.OldImage src={id} />
                <label htmlFor="newImage">
                    <input
                        type="file"
                        name="newImage"
                        id="newImage"
                        accept=".jpg, .png, .svg, .webp, .jpeg"
                        onChange={handleUpload}
                        style={{ display: 'none' }}
                    />
                    <S.NewImage name="newImage" src={newImage} />
                </label>
            </S.UpdateImagesHolder>
            <Button onButtonClick={handleSave}>Salvar</Button>
        </Card >
    );
}

export default UploadImageForm;
