interface ScaleConfig {
    getMinInstances(): number
    getMaxInstances(): number
}
interface ScaledResource {
    getInstances(): number
    scaleUp(): void
    scaleDown(): void
}
class ScaleUseCase {
    private readonly config: ScaleConfig
    private readonly resource: ScaledResource
    constructor(
        config: ScaleConfig,
        resource: ScaledResource
    ) {
        this.config = config
        this.resource = resource
    }
    public execute() {
        if (this.resource.getInstances() > this.config.getMaxInstances()) {
            this.resource.scaleDown()
            return
        }
        if (this.resource.getInstances() < this.config.getMinInstances()) {
            this.resource.scaleUp()
            return
        }
    }
}
class YamlConfig implements ScaleConfig {
    constructor(private readonly yaml: any) {
    }
    getMinInstances(): number {
        try {
            return parseInt(this.yaml.spec.intances.min ?? '1')
        } catch (error) {
            return 1
        }
    }
    getMaxInstances(): number {
        try {
            return parseInt(this.yaml.spec.intances.max ?? '1')
        } catch (error) {
            return 1
        }
    }
}
class EnvironmentConfig implements ScaleConfig {
    getMinInstances(): number {
        try {
            return parseInt(process.env.MIN_INSTANCES ?? '1')
        } catch (error) {
            return 1
        }
    }
    getMaxInstances(): number {
        try {
            return parseInt(process.env.MAX_INSTANCES ?? '1')
        } catch (error) {
            return 1
        }
    }
}
class AlloyDB implements ScaledResource {
    getInstances(): number {
        // vai na gcp e busca as instâncias
        return 10
    }
    scaleUp(): void {
        // vai na gcp e escala +1
    }
    scaleDown(): void {
        // vai na gcp e escala -1
    }
}
class CosmosDB implements ScaledResource {
    getInstances(): number {
        // vai na aws e busca as instâncias
        return 10
    }
    scaleUp(): void {
        // vai na aws e escala +1
    }
    scaleDown(): void {
        // vai na aws e escala -1
    }
}
/// pega o yaml do k8s
const spec = {}
const scaller1 = new ScaleUseCase(
    new YamlConfig(spec),
    new CosmosDB()
)
const scaller2 = new ScaleUseCase(
    new EnvironmentConfig(),
    new CosmosDB()
)
scaller1.execute()
scaller2.execute()
