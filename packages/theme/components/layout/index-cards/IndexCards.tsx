import {Card, Grid} from '@primer/react-brand'
import {MdxFile} from 'nextra'

import styles from './IndexCards.module.css'

type IndexCardsProps = {
  route: string
  folderData: DocsItem[]
}

type DocsItem = MdxFile & {
  title: string
  type: string
  children?: DocsItem[]
  firstChildRoute?: string
  withIndexPage?: boolean
  isUnderCurrentDocsTree?: boolean
}

export function IndexCards({route, folderData}: IndexCardsProps) {
  const filteredData = folderData.filter(item => item.kind === 'MdxPage' && item.route.includes(`${route}/`))

  return (
    <Grid className={styles.IndexCards}>
      {filteredData.map((item: DocsItem, index) => {
        return (
          <Grid.Column span={{medium: 6}} key={`cell-${item.route}`}>
            <Card href={item.route} hasBorder style={{width: '100%'}}>
              <Card.Heading>{item.frontMatter.title}</Card.Heading>
              <Card.Description>{item.frontMatter.description}</Card.Description>
            </Card>
          </Grid.Column>
        )
      })}
    </Grid>
  )
}
