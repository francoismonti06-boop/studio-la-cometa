import {useCallback} from 'react'
import type {SchemaType, PortableTextInputProps} from 'sanity'
import {Button, Card, Flex, Grid, Stack, Text} from '@sanity/ui'

type BlockOption = {
  typeName: string
  title: string
  hint: string
}

const BLOCK_OPTIONS: BlockOption[] = [
  {
    typeName: 'patrimonyFocus',
    title: 'Encadré',
    hint: 'Point patrimonial ou explicatif',
  },
  {
    typeName: 'editorialQuote',
    title: 'Citation',
    hint: 'Mise en avant d’une idée clé',
  },
  {
    typeName: 'layoutBreak',
    title: 'Pleine largeur',
    hint: 'Le contenu suivant passe sous la sidebar',
  },
]

function createKey() {
  return Math.random().toString(36).slice(2, 12)
}

function getArrayMemberType(
  schemaType: PortableTextInputProps['schemaType'],
  typeName: string,
): SchemaType | undefined {
  return schemaType.of.find((member) => {
    const memberName = 'name' in member ? member.name : undefined
    const nestedTypeName =
      'type' in member && member.type && typeof member.type === 'object' && 'name' in member.type
        ? member.type.name
        : undefined

    return memberName === typeName || nestedTypeName === typeName
  }) as SchemaType | undefined
}

export function ModularContentInput(props: PortableTextInputProps) {
  const {renderDefault, readOnly, schemaType, onItemAppend, resolveInitialValue} = props

  const handleAdd = useCallback(
    async (typeName: string) => {
      if (readOnly) return

      const memberType = getArrayMemberType(schemaType, typeName)

      let initialValue: Record<string, unknown> = {
        _type: typeName,
        _key: createKey(),
      }

      if (memberType) {
        try {
          const resolved = await resolveInitialValue(memberType, {})

          if (resolved && typeof resolved === 'object' && !Array.isArray(resolved)) {
            initialValue = {
              ...resolved,
              _key: typeof resolved._key === 'string' ? resolved._key : createKey(),
            }
          }
        } catch (error) {
          console.warn(`Initial value error (${typeName})`, error)
        }
      }

      onItemAppend(initialValue as never)
    },
    [onItemAppend, readOnly, resolveInitialValue, schemaType],
  )

  return (
    <Stack space={3}>
      <Card padding={3} radius={3} tone="transparent">
        <Flex align="center" justify="space-between">
          <Text size={1} weight="semibold">
            Ajouter un bloc
          </Text>
          <Text size={0} muted>
            Encadré, citation ou passage de mise en page
          </Text>
        </Flex>

        <Grid columns={[1, 2, 3]} gap={2} style={{marginTop: 8}}>
          {BLOCK_OPTIONS.map((option) => (
            <Button
              key={option.typeName}
              mode="ghost"
              text={option.title}
              tone="primary"
              onClick={() => handleAdd(option.typeName)}
              disabled={readOnly}
            />
          ))}
        </Grid>
      </Card>

      <Card padding={3} radius={3} border>
        {renderDefault(props)}
      </Card>
    </Stack>
  )
}