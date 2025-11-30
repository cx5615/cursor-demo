import { Card, Typography, Descriptions } from 'antd'
import { i18n } from '../utils/i18n'

const { Title, Paragraph } = Typography

const About = () => {
  const language = i18n.getLanguage()
  const t = i18n.getTranslations(language)

  return (
    <div>
      <Title level={2}>{t.aboutTitle}</Title>
      <Card>
        <Paragraph>{t.aboutContent}</Paragraph>
        <Descriptions title="技术栈信息" bordered column={1} style={{ marginTop: 24 }}>
          <Descriptions.Item label="React">^19.0.0</Descriptions.Item>
          <Descriptions.Item label="React Router DOM">^7.0.0</Descriptions.Item>
          <Descriptions.Item label="Vite">^7.0.0</Descriptions.Item>
          <Descriptions.Item label="@xyflow/react">^12.0.0</Descriptions.Item>
          <Descriptions.Item label="Redux Toolkit">^2.0.0</Descriptions.Item>
          <Descriptions.Item label="Ant Design">^6.0.0</Descriptions.Item>
          <Descriptions.Item label="TypeScript">^5.0.0</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  )
}

export default About

