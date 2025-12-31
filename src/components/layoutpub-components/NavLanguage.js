import React from 'react';
import { Button, Dropdown } from 'antd';
import { DownOutlined, CheckOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { onLocaleChange } from '../../redux/actions/Theme';
import lang from "../../assets/data/language.data.json";

function getLanguageDetail(locale) {
	const data = lang.filter(elm => (elm.langId === locale))
	return data[0]
}

const Selectedlanguage = ({ locale }) => {
	const language = getLanguageDetail(locale)
	const { langName, icon } = language
	return (
		<>
			<img style={{ maxWidth: '20px' }} src={`/img/flags/${icon}.png`} alt={langName} />
			<span className="ml-1 language-container">
				<span className='language-name'> {langName}  </span>
				<DownOutlined />
			</span>
		</>
	)
}

const NavLanguage = () => {

	const { locale } = useSelector(state => state.theme)
	const dispatch = useDispatch()

	const items = lang.map((elm, i) => ({
		key: i,
		label: (
			<div className={locale === elm.langId ? 'ant-dropdown-menu-item-active' : ''}
				onClick={() => dispatch(onLocaleChange(elm.langId))}>
					<span className="d-flex justify-content-between align-items-center">
						<div>
							<img style={{ maxWidth: '20px' }} src={`/img/flags/${elm.icon}.png`} alt={elm.langName} />
							<span className="font-weight-normal ml-2">{elm.langName}</span>
						</div>
						{locale === elm.langId ? <CheckOutlined className="text-success" /> : null}
					</span>
			</div>
		)
	}));

	return (
		<Dropdown menu={{items}} trigger={['hover', 'click']}>
			<Button type="link" className="ant-dropdown-link" onClick={e => e.preventDefault()}>
				<Selectedlanguage locale={locale} />
			</Button>
		</Dropdown>

	)
}

export default NavLanguage;
