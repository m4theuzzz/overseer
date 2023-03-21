import * as S from './styles';
import BottomLogo from "../../images/bottomlogo.png";
import AvatarTest from "../../images/avatartest.png";
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import UpdateImageForm from './uploadImageForm';
import FormModal from '../FormModal';
import { useEffect } from 'react';

export default function Sidebar({ toggle, active, perm }) {
    const location = useLocation();

    const [profileImage, setProfileImage] = useState(AvatarTest);

    const [formModal, setFormModal] = useState({
        open: false,
        info: null,
        partialData: null,
        action: () => { }
    });

    const reloadUserImage = () => {
        if (window.user.profilePicture) {
            setProfileImage(window.user.profilePicture);
        }
    }

    var items = [
        'Painel',
        'Orçamentos',
        'Serviços',
        'Obras',
        'Clientes',
        'Financeiro',
        'Usuários'
    ];
    var pages = [
        'dashboard',
        'budgets',
        'services',
        'constructions',
        'clients',
        'transactions',
        'users'
    ];

    useEffect(() => {
        if (window.user && window.user.profilePicture) {
            setProfileImage(window.user.profilePicture);
        }
    }, []);

    return (
        <>{!!perm &&
            <S.SidebarContainer act={toggle}>
                <FormModal
                    modal={formModal}
                    setModal={setFormModal}
                    Form={UpdateImageForm}
                />
                <S.SidebarMenuContainer>
                    <div>
                        <S.UserDiv>
                            <S.AvatarContainer
                                onClick={() => setFormModal({
                                    open: true,
                                    info: profileImage,
                                    partialData: window.user,
                                    action: () => reloadUserImage()
                                })}
                                src={profileImage}
                            ></S.AvatarContainer>
                            {window.user &&
                                <S.UserInfo>
                                    <p>{window.user.name ?? ""}</p>
                                </S.UserInfo>
                            }
                        </S.UserDiv>

                        {items.map(function (item, index) {
                            var strClass = '';
                            if (location.pathname.indexOf(pages[index]) > -1) {
                                strClass = 'active';
                            } else {
                                strClass = '';
                            }
                            return (
                                <S.StyledNavLink
                                    to={'/' + pages[index]}
                                    className={strClass}
                                    key={index}

                                >
                                    <span>{item}</span>
                                </S.StyledNavLink>
                            );
                        })}
                    </div>
                    <S.LogoContainer src={BottomLogo}></S.LogoContainer>
                </S.SidebarMenuContainer>
            </S.SidebarContainer>
        }</>
    );
}
